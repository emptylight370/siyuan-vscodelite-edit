/** 
 * NOTE 定义需要用到的api
 * 从[Savor](https://github.com/royc01/notion-theme/blob/main/theme.js)抄的
 * 来自[思源api文档](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)
 * TODO 完成所需的所有api写入
 */

import { EnableSettings } from "./types";

/**
 * 向思源请求数据
 * @param url 请求url
 * @param data 请求数据(json encode)
 * @returns Promise<any>?
 */
export async function _rqFORSiyuan(url: string, data: any) {
    const response = await fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            Authorization: `Token ''`
        }
    });
    if (response.status === 200)
        return await response.json();
    else
        return null;
}

/** 
 * @Feature 获取文件
 * @param path 文件路径
 * @param then then?
 * @param obj obj?
 * @returns 文件内容
 */
export async function _getFile(path: string, then = null, obj = null) {
    let url = '/api/file/getFile';
    await _rqFORSiyuan(url, {
        path: path
    }).then((v) => {
        if (then)
            then(v, obj);
    });
}

/**
 * 写入文件
 * @param path 文件路径
 * @param filedata 文件数据
 * @param then then?
 * @param obj obj?
 * @param isDir 是否是路径
 * @param modTime 修改时间
*/
export async function _writeFile(path: string, filedata: any, then = null, obj = null, isDir = false, modTime = Date.now()) {
    let blob = new Blob([filedata]);
    let file = new File([blob], path.split('/').pop());
    let formdata = new FormData();
    formdata.append("path", path);
    formdata.append("file", file);
    formdata.append("isDir", isDir.toString());
    formdata.append("modTime", modTime.toString());
    await fetch("/api/file/putFile", {
        body: formdata,
        method: 'POST',
        headers: {
            Authorization: `Token ""`
        }
    }).then((v) => {
        if (then)
            then(obj);
        return v;
    });
}

/**
 * 发送消息
 * @param string type 消息类型 - "ok" or "error"
 * @param string message 消息内容
 * @param number time 持续时间
 */
export async function _postMessage(type: "ok" | "error", message: string, time = null) {
    if (type == "ok")
        var url = "/api/notification/pushMsg";
    else if (type == "error")
        url = "api/notification/pushErrMsg";
    if (time)
        await _rqFORSiyuan(url, { "msg": message, "timeout": time });
    else
        await _rqFORSiyuan(url, { "msg": message });
}

/**
 * 获取设置
 */
export async function getSettings() {
    var str: EnableSettings[];
    // var res = _analyseResponse(_getFile("/data/snippets/vsc_edit.config.json"));
    await _getFile("/data/snippets/vsc_edit.config.json", async (v) => {
        if (v == null) {
            v = globalThis.defaultConf;
            putSettings(v);
        }
        str = await showElementSettings(v);
    });
    return str;
}

/**
 * 保存设置
 * @param settings
 * @returns
 */
export async function putSettings(settings) {
    if (settings == null) {
        return;
    }
    await _writeFile("/data/snippets/vsc_edit.config.json", JSON.stringify(settings), null, null, false, Date.now());
}

/**
 * 获取当前启用的设置并返回对应的列表
 * @param settings
 * @returns
 */
async function showElementSettings(settings) {
    var lab: EnableSettings[] = [];
    // 检测配置文件的版本
    if (settings["version"] < defaultConf["version"] || settings["version"] == undefined) {
        // console.log(settings["version"]);
        await _postMessage("ok", localMessage["confUpdate"][defLag]);
    }
    // ! 从设置中获取启用的设置项
    // 代码块
    if (settings["theme"]["codeBlock"] == true) {
        lab.push("codeBlock");
    }
    // 引用
    if (settings["theme"]["reference"] == true) {
        lab.push("reference");
    }
    // 集市
    if (settings["theme"]["bazaar"] == true) {
        lab.push("bazaar");
    }
    // 嵌入块
    if (settings["theme"]["embeddedBlock"] == true) {
        lab.push("embeddedBlock");
    }
    // 标题
    if (settings["theme"]["title"] == true) {
        lab.push("title");
        // 标题阴影
        if (settings["theme"]['titleShadow'] == true) {
            lab.push("titleShadow");
        }
        // 标题图标
        if (settings["theme"]["titleIcon"] == true) {
            lab.push("titleIcon");
        }
    }
    // 快捷键面板插件
    if (settings["plugins"]["shortcutPanel"] == true) {
        lab.push("shortcutPanel");
    }
    // 数据库
    if (settings["theme"]["database"] == true) {
        lab.push("database");
    }
    // 文档树和大纲
    if (settings["theme"]["doctree"] == true) {
        lab.push("doctree");
    }
    // 替换背景图插件
    if (settings["plugins"]["backgroundCoverDesktop"] == true) {
        lab.push("backgroundCoverDesktop");
    }
    if (settings["plugins"]["backgroundCoverMobile"] == true) {
        lab.push("backgroundCoverMobile");
    }
    // 数学公式面板插件
    if (settings["plugins"]["mathPanel"] == true) {
        lab.push("mathPanel");
    }
    // 标记
    if (settings["theme"]["mark"] == true) {
        lab.push("mark");
    }
    return lab;
}