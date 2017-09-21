/*eslint-disable */
import $ from 'jquery'
import './jQueryRotate3'
import './jquery.easing.min'

var turnWheel = {
    rewardNames: [], //转盘奖品名称数组
    colors: [], //转盘奖品区块对应背景颜色
    outsideRadius: 192, //转盘外圆的半径
    textRadius: 155, //转盘奖品位置距离圆心的距离
    insideRadius: 68, //转盘内圆的半径
    startAngle: 0, //开始角度
    id: [], // 奖品编号

    bRotate: false //false:停止;ture:旋转
};

// 图片信息
var imgSrc = []

export function init(obj) {
    for (var i = 0; i < obj.length; i++) {
        turnWheel.rewardNames.push(obj[i].name)
        turnWheel.id.push(obj[i].wheel_id)
        imgSrc.push(obj[i].pic)
            // console.log(turnWheel.rewardNames, turnWheel.id)
    }
}

turnWheel.colors = [
    "#FF8584", "#FE6869",
    "#FF8584", "#FE6869",
    "#FF8584", "#FE6869",
    "#FF8584", "#FE6869",
    "#FF8584", "#FE6869",
    "#FF8584", "#FE6869"
];

//旋转转盘 item:奖品序号，从0开始的; txt：提示语 ,count 奖品的总数量; slef vue.show
export function rotateFunc(item, tip, count, self) {
    var ids = ''
        // console.log(turnWheel.id)
    for (var s = 0; s < turnWheel.id.length; s++) {
        if (turnWheel.id[s] === item) {
            // console.log(turnWheel.id[s], item)
            ids = s
        }
    }
    // console.log(ids)
    // 应该旋转的角度，旋转插件角度参数是角度制。
    var baseAngle = 360 / count;
    // 旋转角度 == 270°（当前第一个角度和指针位置的偏移量） - 奖品的位置 * 每块所占的角度 - 每块所占的角度的一半(指针指向区域的中间)
    var angles = 360 * 3 / 4 - (ids * baseAngle) - baseAngle / 2; // 因为第一个奖品是从0°开始的，即水平向右方向
    $('#wheelCanvas').stopRotate();
    // 注意，jqueryrotate 插件传递的角度不是弧度制。
    // 哪个标签调用方法，旋转哪个控件
    $('#wheelCanvas').rotate({
        angle: 0, //初始旋转的角度数，并且立即执行
        animateTo: angles + 360 * 5, // 这里多旋转了5圈，圈数越多，转的越快
        duration: 8000, //指定使用animateTo的动画执行持续时间
        callback: function() { // 回调方法
            $("#tip").text(tip);
            self.show = true
            turnWheel.bRotate = !turnWheel.bRotate;
            if (self.show5 === false) {
                alert('很遗憾，您没有抽中任何奖品，再接再励哦！')
            }
        }
    });
};

export function tou(self, id) {
    // 正在转动，直接返回
    if (turnWheel.bRotate) return;

    turnWheel.bRotate = !turnWheel.bRotate;
    var count = turnWheel.rewardNames.length;

    // 这里应该是从服务器获取用户真实的获奖信息（对应的获奖序号）
    // 简单模拟随机获取奖品的序号(奖品个数范围内)
    var item = id
        // 开始抽奖
    rotateFunc(item, turnWheel.rewardNames[item], count, self);
}

function getModileType() {
    var u = navigator.userAgent
        // var app = navigator.appVersion
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    if (isAndroid) {
        return 1
    }
    if (isIOS) {
        return 2
    }
}

function perImg(ctx, url, callback) {
    var img = new Image(); //创建一个Image对象，实现图片的预下载 
    img.src = "";
    img.src = url;
    if (url !== '' && img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
        //callback.call(img); 
        ctx.drawImage(img, -33.5, 10, 64, 64);
        return; // 直接返回，不用再处理onload事件  
    }
    img.onload = function() { //图片下载完毕时异步调用callback函数。
        ctx.drawImage(img, -33.5, 10, 64, 64);
    };
    // img.src = url;
}

/*
 * 渲染转盘
 * */
export function drawWheelCanvas() {

    // 获取canvas画板，相当于layer？？
    var canvas = document.getElementById("wheelCanvas");
    //    var canvas = ($("#wheelCanvas")).get()[0]; // 注意，jQuery获取的是包装过的对象，不是DOM对象,可以进行转换

    // 计算每块占的角度，弧度制
    var baseAngle = Math.PI * 2 / (turnWheel.rewardNames.length);
    // 获取上下文
    var ctx = canvas.getContext("2d");

    var canvasW = canvas.width; // 画板的高度
    var canvasH = canvas.height; // 画板的宽度
    //在给定矩形内清空一个矩形
    ctx.clearRect(0, 0, canvasW, canvasH);

    //strokeStyle 绘制颜色
    ctx.strokeStyle = "#FFBE04"; // 红色
    //font 画布上文本内容的当前字体属性
    ctx.font = '16px Microsoft YaHei';

    // 注意，开始画的位置是从0°角的位置开始画的。也就是水平向右的方向。
    // 画具体内容
    for (var index = 0; index < turnWheel.rewardNames.length; index++) {
        // alert(turnWheel.rewardNames.length)
        // alert(turnWheel.rewardNames)
        // alert(index)
        // 当前的角度
        var angle = turnWheel.startAngle + index * baseAngle;
        // 填充颜色
        ctx.fillStyle = turnWheel.colors[index];

        // 开始画内容
        // ---------基本的背景颜色----------
        ctx.beginPath();
        /*
         * 画圆弧，和IOS的Quartz2D类似
         * context.arc(x,y,r,sAngle,eAngle,counterclockwise);
         * x :圆的中心点x
         * y :圆的中心点x
         * sAngle,eAngle :起始角度、结束角度
         * counterclockwise : 绘制方向,可选，False = 顺时针，true = 逆时针
         * */
        ctx.arc(canvasW * 0.5, canvasH * 0.5, turnWheel.outsideRadius, angle, angle + baseAngle, false);
        ctx.arc(canvasW * 0.5, canvasH * 0.5, turnWheel.insideRadius, angle + baseAngle, angle, true);
        ctx.stroke();
        ctx.fill();
        //保存画布的状态，和图形上下文栈类似，后面可以Restore还原状态（坐标还原为当前的0，0），
        ctx.save();

        /*----绘制奖品内容----重点----*/
        // 红色字体
        ctx.fillStyle = "#fff";
        var rewardName = turnWheel.rewardNames[index];
        var line_height = 17;
        // translate方法重新映射画布上的 (0,0) 位置
        // context.translate(x,y);
        // 见PPT图片，
        var translateX = canvasW * 0.5 + Math.cos(angle + baseAngle / 2) * turnWheel.textRadius;
        var translateY = canvasH * 0.5 + Math.sin(angle + baseAngle / 2) * turnWheel.textRadius;
        ctx.translate(translateX, translateY);

        // rotate方法旋转当前的绘图，因为文字适合当前扇形中心线垂直的！
        // angle，当前扇形自身旋转的角度 +  baseAngle / 2 中心线多旋转的角度  + 垂直的角度90°
        ctx.rotate(angle + baseAngle / 2 + Math.PI / 2);

        /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
        // canvas 的 measureText() 方法返回包含一个对象，该对象包含以像素计的指定字体宽度。
        // fillText() 方法在画布上绘制填色的文本。文本的默认颜色是黑色. fillStyle 属性以另一种颜色/渐变来渲染文本
        /*
         * context.fillText(text,x,y,maxWidth);
         * 注意！！！y是文字的最底部的值，并不是top的值！！！
         * */
        var zh = rewardName.replace(/[^\u4e00-\u9fa5]/gi, "")
        if (zh === '谢谢参与') {
            // console.log('text')
            var rewardNames = rewardName.split("");
            for (var j = 0; j < rewardNames.length; j++) {
                ctx.fillText(rewardNames[j], -ctx.measureText(rewardNames[j]).width / 2, j * line_height);
                // console.log(j * line_height)
            }
        } else if (rewardName.indexOf("谢谢") == -1 && rewardName.length > 6) { //奖品名称长度超过一定范围
            rewardName = rewardName.substring(0, 6) + "||" + rewardName.substring(6);
            var rewardNames = rewardName.split("||");
            for (var j = 0; j < rewardNames.length; j++) {
                ctx.fillText(rewardNames[j], -ctx.measureText(rewardNames[j]).width / 2, j * line_height);
                // ctx.drawImage(imgQb, -ctx.measureText(rewardNames[j]).width / 2, j * line_height, 30, 30) ////////////////////////////////
            }
        } else {
            //在画布上绘制填色的文本。文本的默认颜色是黑色
            ctx.fillText(rewardName, -ctx.measureText(rewardName).width / 2, 0);
        }

        //添加对应图标
        perImg(ctx, imgSrc[index], function() {
            ctx.drawImage(img, -33.5, 10, 64, 64)
        })


        //还原画板的状态到上一个save()状态之前
        ctx.restore();

        /*----绘制奖品结束----*/

    }
}
/*eslint-enable */