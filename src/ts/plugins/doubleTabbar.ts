// 添加tabbar的观察器，不要再失效了
export function addTabbarObserver(tabbar: HTMLUListElement) {
    if (globalThis.vscObserver.tabbarObserver == null) {
        // 先调用一次调节函数
        changeTabbar(tabbar);
        // 定义观察器
        globalThis.vscObserver.tabbarObserver = new MutationObserver(function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type == 'childList' || mutation.type == 'attributes') {
                    console.log("调节tab宽度");
                    changeTabbar(tabbar);
                }
            }
        });
        // 绑定观察器
        globalThis.vscObserver.tabbarObserver.observe(tabbar, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"]
        });
    }
}

// 调节tab宽度用
function changeTabbar(tabbar: HTMLUListElement) {
    var itemList = tabbar.querySelectorAll(".item");
    var pinList = tabbar.querySelectorAll(".item--pin");
    var width = 0;
    // 去掉右侧宽度
    Array.from(itemList).forEach((item) => {
        (item as HTMLLIElement).style.removeProperty("margin-right");
    });
    // 计算所有钉住页签的宽度
    Array.from(pinList).forEach((item) => {
        width += (item as HTMLLIElement).getBoundingClientRect().width;
    })
    // 设置钉住页签右侧宽度
    if (width <= document.querySelector(".layout__center").getBoundingClientRect().width && width > 0) {
        (pinList[pinList.length - 1] as HTMLLIElement).style.marginRight = `calc(100% - ${width}px)`;
    }
}