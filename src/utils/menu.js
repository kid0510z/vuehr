import {getRequest} from "./app";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest('/sys/config/getMenus').then(data => {
        console.log(data);
        if (data.success) {
            let fmtRoutes = formatRoutes(data.data);
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
            component: function (resolve) {
                if (component === 'Home') {
                    require([`../views/${component}.vue`], resolve);
                } else if (component.startsWith('Emp')) {
                    require([`../views/emp/${component}.vue`], resolve);
                } else if (component.startsWith('Per')) {
                    require([`../views/per/${component}.vue`], resolve);
                } else if (component.startsWith('Sal')) {
                    require([`../views/sal/${component}.vue`], resolve);
                } else if (component.startsWith('Sta')) {
                    require([`../views/sta/${component}.vue`], resolve);
                } else if (component.startsWith('Sys')) {
                    require([`../views/sys/${component}.vue`], resolve);
                } else {
                    console.log('没有找到匹配');
                }
            }
        };
        fmtRoutes.push(fmRouter);

    })


    return fmtRoutes;
};