import {getRequest} from "./app";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }


    getRequest('/sys/config/getMenus').then(data => {
        if (data) {
            let fmtRoutes = formatRoutes(data);
            // 添加路由
            router.addRoutes(fmtRoutes);
            // 执行initRoutes方法，添加到 store
            store.commit('initRoutes', fmtRoutes);
        }
    })

};

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(router => {
        let {
            id,
            url,
            path,
            name,
            iconCls,
            meta,
            component,
            children
        } = router;

        // children不为空，并且children为数组，递归处理
        if (children && children instanceof Array) {

            children = formatRoutes(children);
        }

        let fmRouter = {
            id: id,
            url: url,
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children,
            component(resolve) {
                require(['../views/' + component + '.vue'], resolve);
            }
        };
        fmtRoutes.push(fmRouter);


    })


    return fmtRoutes;
};