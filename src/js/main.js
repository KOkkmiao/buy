/**
 * 常用JS变量:
 * agentEvent = 代理模式下自动点击模块
 * acEvent= 无障碍模式下自动点击模块
 * device = 设备信息模块
 * file = 文件处理模块
 * http = HTTP网络请求模块
 * shell = shell命令模块
 * thread= 多线程模块
 * image = 图色查找模块
 * utils= 工具类模块
 * global = 全局快捷方式模块
 * 常用java变量：
 *  context : Android的Context对象
 *  javaLoader : java的类加载器对象
 * 导入Java类或者包：
 *  importClass(类名) = 导入java类
 *      例如: importClass(java.io.File) 导入java的 File 类
 *  importPackage(包名) =导入java包名下的所有类
 *      例如: importPackage(java.util) 导入java.util下的类
 *
 */
//setting parameters name

const App_Number = "app_number"
//setting parameters
const Click_Sleep_Name = "click_sleep"
var Click_Sleep = 0

function main() {
    var app_number = readConfigInt(App_Number);

    Click_Sleep = readConfigInt(Click_Sleep_Name);
    // logd("我是消息{},{}","测试1",2)
    logd("参数 点击时间{},app:{}",Click_Sleep,app_number);
    switch (app_number) {
        case 0:
            dingDong()
            return
        case 1:
            meiTuan()
            return
    }
}

const Ding_Dong_App_Name = "com.yaya.zone"

const Buy_Car = "购物车"

const Refresh = "重新加载"

const Go_Pay = "去结算.*"

const First_Page_Sleep = 5 * 1000

function dingDong() {
    let openApp = utils.openApp(Ding_Dong_App_Name);
    if (!openApp) {
        toast("没有打开叮咚买菜")
        return
    }
    toast("open success")
    //辅助进程 专门处理异常
    backGroundSupport()
    sleep(First_Page_Sleep)
    var buy_car = text(Buy_Car);
    logd("点击购物车")
    var refresh = text(Refresh);
    var go_pay = textMatch(Go_Pay)
    var succ = clickWait(buy_car, go_pay, refresh)
    logd("购物车等待流程" + succ)
    //点击购买
    for (let i = 0; ; i++) {
        click(go_pay)
        if (has(textMatch("去结算.*"))) {
            continue
        }
        break
    }

    if (!succ) {
        toast("失败了");
        return
    }
    /**------购买流程-------**/
    payDetail()
}
function backGroundSupport(){
    thread.execAsync(function () {
        for (; ;) {
            // 出现继续支付
            let jixuzhifu = text("继续支付");
            if (has(jixuzhifu)) {
                logd("商品失效阻拦")
                click(jixuzhifu)
            }
            let fail = text("下单失败")

            if (has(fail)) {
                logd("下单失败阻拦")
                clickPoint(200, 2700)
            }
            sleep(500);
        }
    })
}
const Pay_Page_Sleep = 2*1000

const Please_Choose_Time = "请选择送达时间"

function payDetail() {
    //选择时间
    sleep(Pay_Page_Sleep);
    let node = textMatch(Please_Choose_Time)
    var res = click(node)
    //拿到时间
    sleep(Pay_Page_Sleep);
    if (res) {
        let tn = depth(9).clz("android.view.ViewGroup").clickable(true)

        let result = clickRandom(tn)
    }
    sleep(Pay_Page_Sleep);
    logd("开始点击支付")
    let s = text("立即支付");
    if (has(s)) {
        logd("找到立即支付");
    }
    for (let i = 0; ; i++) {
        click(s)
        logd("点击");
        // 如果到了支付页面就停止
        if (has(textMatch("确认交易"))) {
            toast("已经到达支付页面");
            thread.stopAll()
            return
        }
        sleep(Click_Sleep);
    }
}

function clickWait(clickSelector, waitElement, refreshElement) {
    var succ = click(clickSelector)
    if (succ) {
        toast("点击失败");
    }
    // 等待几秒查看需要页面是否已经刷新
    let i = 0
    for (; i < 20; i++) {
        if (has(waitElement)) {
            logd("匹配到了");
            return true
        }
        //refresh
        logd("等待 ...");
        click(refreshElement)
        sleep(1000 * 1)
    }

    if (i == 3) {
        return false
    }
    return true
}

function meiTuan() {

}

main();
