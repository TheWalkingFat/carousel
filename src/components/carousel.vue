<template>
    <div class="carousel">
        <div class="carousel-section" ref="carousel" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
            <div class="img-section" v-for="item in imgArr">
                <img :src="item" alt="图片加载失败">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                //实现首位相连，第一张图片之前插入最后一张，最后一张图片之后插入第一张
                imgArr: [
                    require("../assets/images/carousel3.png"),
                    require("../assets/images/carousel1.png"),
                    require("../assets/images/carousel2.png"),
                    require("../assets/images/carousel3.png"),
                    require("../assets/images/carousel1.png"),
                ],
                index: 1,
                timer: null,
                startX: 0, //开始触摸的位置
                moveX: 0, //滑动时的位置
                endX: 0, //结束触摸的位置
                disX: 0, //移动距离
                isMove: false, //是否滑动过
                imgTotal: 3,
            }
        },
        created(){
            let _this = this;
            this.timer = setInterval(function(){
                _this.index++ ;   //自动轮播到下一张
                //改变定位  动画的形式去改变  transition transform translate
                _this.addTransition();    //加过渡动画
                _this.setTranslateX(-_this.index * window.screen.width);  //定位
            },3000);
        },
        mounted(){
            let _this = this;
            this.transitionEnd(
                function(){
                    //处理事件结束后的业务逻辑
                    if(_this.index > _this.imgTotal ){
                        _this.index = 1;
                    }
                    else if(_this.index <= 0){
                        _this.index = _this.imgTotal;
                    }
                    _this.removeTransition(); //清除过渡
                    _this.setTranslateX(-_this.index * window.screen.width);  //定位
                }
            );
            this.pageInit();
        },
        beforeDestroy() {
            if(this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
                clearInterval(this.timer); //关闭
            }
        },
        methods: {
            pageInit(){
               
            },

            touchStart(e){
                e = e || event;
                // e.preventDafault();
                //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
                if(e.touches.length == 1){
                    clearInterval(this.timer);   //清除定时器
                    this.startX = e.touches[0].clientX; //记录开始位置
                }
            },

            touchMove(e){
                e = e || event;
                // e.preventDafault();
                if(e.touches.length == 1){
                    //滑动时距离浏览器左侧的距离
                    this.moveX = e.touches[0].clientX;

                    //实时的滑动的距离-起始位置=实时移动的位置
                    this.disX = this.moveX - this.startX;

                    this.removeTransition(); //清除过渡
                    this.setTranslateX(-this.index * window.screen.width + this.disX);  //实时的定位
                    this.isMove = true;  //证明滑动过
                }
            },

            touchEnd(e){
                e = e || event;
                // e.preventDafault();
                if(e.changedTouches.length == 1){
                    // this.carouselScroll();

                    // 滑动超过 1/3 即为滑动有效，否则即为无效，则吸附回去
                    if(this.isMove && Math.abs(this.disX) > window.screen.width/3){
                        //5.当滑动超过了一定的距离  需要 跳到 下一张或者上一张  （滑动的方向）*/
                        if(this.disX > 0){  //上一张
                            this.index --;
                        }
                        else{   //下一张
                            this.index ++;
                        }
                    }
                    this.addTransition();    //加过渡动画
                    this.setTranslateX(-this.index * window.screen.width);   //定位

                    if(this.index > this.imgTotal ){
                        this.index = 1;
                    }
                    else if(this.index <= 0){
                        this.index = this.imgTotal;
                    }

                    //重置参数
                    this.startX = 0;
                    this.moveX = 0;
                    this.disX = 0;
                    this.isMove = false;

                    let _this = this;
                    //加定时器
                    clearInterval(_this.timer);   //严谨 再清除一次定时器
                    _this.timer= setInterval(function(){
                        _this.index++ ;  //自动轮播到下一张
                        _this.addTransition();    //加过渡动画
                        _this.setTranslateX(-_this.index * window.screen.width);    //定位
                    },3000);
                }
            },

            //公用方法
            //加过渡
            addTransition(){
                let $dom = this.$refs.carousel;
                $dom.style.transition = "all 0.3s";
                $dom.style.webkitTransition = "all 0.3s";/*做兼容*/
            },
            //清除过渡
            removeTransition(){
                let $dom = this.$refs.carousel;
                $dom.style.transition = "none";
                $dom.style.webkitTransition = "none";
            },
            //定位
            setTranslateX(translateX){
                let $dom = this.$refs.carousel;
                $dom.style.transform = "translateX("+translateX+"px)";
                $dom.style.webkitTransform = "translateX("+translateX+"px)";
            },

            //监听动画结束事件
            transitionEnd(callback){
                //1.给谁加事件
                //2.事件触发后处理什么业务
                let dom = this.$refs.carousel;
                if(!dom || typeof dom != 'object'){
                    //没dom的时候或者不是一个对象的时候 程序停止
                    return false;
                }
                dom.addEventListener('transitionEnd', function(){
                    callback && callback();
                });
                dom.addEventListener('webkitTransitionEnd', function(){
                    callback && callback();
                });
            }
        },
    };
</script>

<style lang="scss">
    .carousel{

        .carousel-section{
            width: 500%;
            height: 160px;
            display: flex;
            overflow-x: hidden;

            .img-section{
                width: 100%;
                height: 160px;

                img{
                    width: 100%;
                    height: 160px;
                }
            }
        }
    }

</style>