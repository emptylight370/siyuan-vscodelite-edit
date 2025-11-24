/**
 * @Description 根据路径获取人类可读路径
 * @Feature
 * @param noteBook 笔记本id
 * @param path 路径
 * @return
 * @since 1.2.0
 * @version 1.2.2
 */
async function _getReadablePath(noteBook, path) {
    let url = "/api/filetree/getHPathByPath";
    await _rqFORSiyuan(url, {
        notebook: noteBook,
        path: path,
    });
}

/**
 * 向指定父级创建追加一个子元素，并可选添加ID,
 * @param {Element} fatherElement
 * @param {string} addElementTxt 要创建添加的元素标签
 * @param {string} setId
 * @returns addElementObject
 * @since 1.2.0
 * @version 1.2.2
 */
function addinsertCreateElement(fatherElement, addElementTxt, setId = null) {
    if (!fatherElement) console.error("指定元素对象不存在！");
    if (!addElementTxt) console.error("未指定字符串！");
    var element = document.createElement(addElementTxt);
    if (setId) element.id = setId;
    fatherElement.appendChild(element);
    return element;
}

/**
 * 向指定元素后创建插入一个元素，可选添加ID
 * @param {Element} targetElement 目标元素
 * @param {String} addElementTxt 要创建添加的元素标签
 * @param {String} setId 为创建元素设置ID
 * @since 1.2.0
 * @version 1.2.2
 */
function insertCreateAfter(targetElement, addElementTxt, setId = null) {
    if (!targetElement) console.error("指定元素对象不存在！");
    if (!addElementTxt) console.error("未指定字符串！");
    var element = document.createElement(addElementTxt);
    if (setId) element.id = setId;
    var parent = targetElement.parentNode; //得到父节点
    if (parent.lastChild === targetElement) {
        //如果最后一个子节点是当前元素那么直接添加即可
        parent.appendChild(element);
        return element;
    } else {
        parent.insertBefore(element, targetElement.nextSibling); //否则，当前节点的下一个节点之前添加
        return element;
    }
}

/**
 * 向指定元素前创建插入一个元素，可选添加ID
 * @param {*} targetElement 目标元素
 * @param {*} addElementTxt 要创建添加的元素标签
 * @param {*} setId 为创建元素设置ID
 * @since 1.2.0
 * @version 1.2.2
 */
function insertCreateBefore(targetElement, addElementTxt, setId = null) {
    if (!targetElement) console.error("指定元素对象不存在！");
    if (!addElementTxt) console.error("未指定字符串！");
    var element = document.createElement(addElementTxt);
    if (setId) element.id = setId;
    targetElement.parentElement.insertBefore(element, targetElement);
    return element;
}

/**
 * @Description
 * @Feature 解析思源的响应
 * @param response
 * @return data or null
 * @since 1.2.0
 * @version 1.2.2
 */
async function _analyseResponse(response) {
    let r = await response;
    return r.code === 0 ? r.data : null;
}

/**
 * 得到思源toolbar
 * @returns
 * @since 1.2.0
 * @version 1.2.2
 */
function getSiYuanToolbar() {
    return document.getElementById("toolbar");
}

/**
 * 简单判断目前思源是否是pc窗口模式
 * @since 1.2.0
 * @version 1.3.5
 */
function isPcWindow() {
    var tag = document.body.classList.contains("body--window");
    if (tag) return tag;
    tag = document.body.classList.contains("body--win32");
    return tag;
}

/**
 * 简单判断目前思源是否是手机模式
 * @since 1.2.0
 * @version 1.3.5
 */
function isPhone() {
    return document.getElementById("editor");
}
