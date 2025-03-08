// 新建并添加第二个标签栏
export function addSecondTabbar() {
    // 新建一个容器
    var container = document.createElement("div");
    container.classList.add("fn__flex");
    // 新建一个标签栏
    var tabbar = document.createElement("ul");
    tabbar.className = "fn__flex layout-tab-bar";
    tabbar.id = "vscTabBar";
    tabbar.style.width = "100%";
    container.appendChild(tabbar);
    // 获取原本的标签栏
    var center = document.querySelector(".layout__center");
    var originalTabbar = center.querySelector(".layout-tab-bar");
    // 获取它的父元素
    var originalContainer = originalTabbar.parentElement;
    // 为容器添加事件，需要转接target给原标签
    container.addEventListener("click", (e) => {
        dispatchEventTo(originalContainer, "click", e);
        var nowTarget = e.target as HTMLElement;
        if (!nowTarget.classList.contains("item")) {
            nowTarget = nowTarget.parentElement;
        }
        var originalTarget = originalTabbar.querySelector(`[data-id="${nowTarget.getAttribute("data-id")}"]`);
        Object.defineProperty(e, "target", { value: originalTarget });
        dispatchEventTo(originalContainer, "click", e);
    });
    container.addEventListener("dblclick", (e) => {
        dispatchEventTo(originalContainer, "dbclick", e);
        var nowTarget = e.target as HTMLElement;
        if (!nowTarget.classList.contains("item")) {
            nowTarget = nowTarget.parentElement;
        }
        var originalTarget = originalTabbar.querySelector(`[data-id="${nowTarget.getAttribute("data-id")}"]`);
        Object.defineProperty(e, "target", { value: originalTarget });
        dispatchEventTo(originalContainer, "dbclick", e);
    })
    // 获取更高一级父元素
    var parentContainer = originalContainer.parentElement;
    // 把新建的容器插入到原本的标签栏前面
    parentContainer.insertBefore(container, originalContainer);
    return container;
}

// 为原本的标签栏添加观察器
export function tabbarobserver(originalTabbar: HTMLUListElement, newTabbar: HTMLUListElement) {
    if (originalTabbar) {
        hide_original(originalTabbar, newTabbar);
        globalThis.observer.originalTabbarObserver = new MutationObserver(function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 子元素列表发生变化
                    hide_original(originalTabbar, newTabbar);
                }
            }
        })
        globalThis.observer.originalTabbarObserver.observe(originalTabbar, { childList: true, subtree: true });
    }
    if (newTabbar) {
        // show_original(originalTabbar, newTabbar);
        globalThis.observer.newTabbarObserver = new MutationObserver(function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 子元素列表发生变化
                    show_original(originalTabbar, newTabbar);
                }
            }
        })
        globalThis.observer.newTabbarObserver.observe(newTabbar, { childList: true, subtree: true });
    }
}

// 为原本的标签栏隐藏标签
function hide_original(original: HTMLUListElement, newTabbar: HTMLUListElement) {
    // 获取所有的钉住的标签页
    var pinList = original.querySelectorAll(".item--pin");
    // 获取新标签栏的所有标签
    var newList = newTabbar.querySelectorAll(".item");
    // 检查标签列表
    pinList.forEach(item => {
        if (!Array.from(newList).includes(item)) {
            // 复制新标签
            var newTab = item.cloneNode(true);
            // 点击新标签页时同时激活原标签页
            newTab.addEventListener("click", () => {
                // item.parentElement.parentElement.click();
                (item as HTMLLIElement).click();
                // (item as HTMLLIElement).classList.add("item--focus");
                // (newTab as HTMLLIElement).classList.add("item--focus");
            })
            newTabbar.appendChild(newTab);
            // 隐藏原本的标签
            item.classList.add("fn__none");
            console.log("隐藏标签");
            console.log(item);
        }
    });
    // 先假定钉住的标签页不会因标签页过多被关闭
    // 同步激活状态
    var activateID = original.querySelector(".item--focus").getAttribute("data-id");
    newList.forEach(item => {
        if (item.getAttribute('data-id') != activateID) {
            item.classList.remove("item--focus");
        }
    })
}

// 为原本的标签栏显示标签
function show_original(original: HTMLUListElement, newTabbar: HTMLUListElement) {
    // 获取新标签栏的所有标签
    var newList = newTabbar.querySelectorAll(".item");
    // 遍历标签页
    newList.forEach(item => {
        // 获取标签的data-id
        var dataId = item.getAttribute("data-id");
        // 获取原本对应的标签页
        var originalTab = original.querySelector(`[data-id='${dataId}']`);
        // 找出未钉住的所有标签
        if (!item.classList.contains(".item--pin")) {
            // 显示原本的标签
            originalTab.classList.remove(".item--pin");
            originalTab.classList.remove("fn__none");
            // 删除新标签
            newTabbar.removeChild(item);
            console.log("显示标签");
            console.log(originalTab);
        }
        // 同步激活时间
        var activateTime = item.getAttribute("data-activetime");
        if (activateTime > originalTab.getAttribute("data-activetime")) {
            originalTab.setAttribute("data-activetime", activateTime);
        }
        // 同步聚焦状态
        item.className = originalTab.className;
    })
}

// 用于传递事件的事件分派函数
function dispatchEventTo(targetElement: Element, eventType: string, event: Event) {
    var newEvent = new Event(eventType, {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        composed: event.composed
    });
    targetElement.dispatchEvent(newEvent);
}