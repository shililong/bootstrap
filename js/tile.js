+function($){
	"use strict";   //使用严格模式 ES5
    //插件类及原型方法定义
    //Tile类函数定义
     var Tile = function(element,options){
       this.$element = $(element);
       this.options = options;
       //插件运行参数，根据初始化代码，优先级别最高的是所单击元素上的data-属性
       //然后才是默认值
       this.frames = this.$element.children(".tile-content");   //查找有多少主区去要滚动 
       this.currentIndex = 0;                                   //当前所显示主区域的索引
       this.interval = 0;                                       //触发设置
       this.size = {
           'width' : this.$element.width(),                     //获取当前磁铁贴的高度和宽度
           'height' : this.$element.height()
       };
    
       //确保默认的参数都是正常传值，如果是undefined,就使用默认传值 
       if(this.options.direction == undefined){this.options.direction = Tile.DEFAULTS.direction;}
       if(this.options.period == undefined){this.options.period = Tile.DEFAULTS.period;}
       if(this.options.duration == undefined){this.options.duration = Tile.DEFAULTS.duration;}
       if(this.options.easing == undefined){this.options.easing = Tile.DEFAULTS.easing;}
       //定义一个默认的动画过度效果，可以用jQuery的easing插件
       $.easing.doubleSqrt = function(t){ 
       	 return Math.sqrt(Math.sqrt(t));
       	 console.log('t'+t);
       };

      }
     
     //默认值定义
      Tile.DEFAULTS = {
          direction : 'slideLeft',
          period : '3000',
          duration : '700' ,
          easing : 'doubleSqrt'

       }

     //启动执行动画 
     Tile.prototype.start = function(){
     	/* body... */
     	var that = this;
        this.interval = setInterval(function(){
           that.animate();  //动画处理效果
        }, that.options.period);

     }

    //暂停动画
    Tile.prototype.pause = function(){
    	/* body... */
    	var that = this;
    	clearInterval(that.interval);
    }
    
    //动画处理入口，再分别调用各自方向的动画处理 效果
    Tile.prototype.animate = function(){
    	/* body... */
    	var that = this;
    	var currentFrame = this.frames[this.currentIndex] , nextFrame;   //定义currentFrame和nexrFrame
    	this.currentIndex += 1;
        if(this.currentIndex >= this.frames.length) this.currentIndex = 0;
        nextFrame = this.frames[this.currentIndex];
        //根据滚动的方向分别调用不同的内部方法，参数是
        //当前要滚动的是tile-content,下一个也是
        switch(this.options.direction){
        	case 'slideLeft':
        		this.slideLeft(currentFrame,nextFrame);
        		break;
        	case 'slideRight':
        	    this.slideRight(currentFrame,nextFrame);
        	    break;
        	case 'slideDown': 
        	    this.slideDown(currentFrame,nextFrame);
        	    break;
        	case 'slideUpDown':
        	    this.slideUpDown(currentFrame,nextFrame);
        	    break;
            case 'slideLeftRight':
        	    this.slideLeftRight(currentFrame,nextFrame);
        	    break;
        	default:
        		this.slideUp(currentFrame,nextFrame);
        		break;
        }
    }
   //左右来回滚动
   Tile.prototype.slideLeftRight = function(currentFrame,nextFrame){
   	/* body... */
       if(this.currentIndex % 2 ==1)
       	 this.slideLeft(currrentFrame,nextFrame);
       else
         this.slideRight(currrentFrame,nextFrame);
   }

   //上下来回滚动

   Tile.prototype.slideUpDown = function(currentFrame,nextFrame){
   	/* body... */
       if(this.currentIndex % 2 ==1)
       	 this.slideUp(currrentFrame,nextFrame);
       else
         this.slideDown(currrentFrame,nextFrame);
   }
   
   //一直向上滑动的效果
   Tile.prototype.slideUp = function(currentFrame,nextFrame){
   	/* body... */
      var move = this.size.height;
      var options = {
         'duration' : this.options.duration,
         'easing'   : this.options.easing

      };

      $(currentFrame).animate({ top : -move },options);
      $(nextFrame)
             .css({ top : move})
             .show() 
             .animate({ top : 0 },options);
   }

   //一直向下滑动
   Tile.prototype.slideDown = function(currentFrame,nextFrame){
   	/* body... */
   	  var move = this.size.height;
   	  var options = {
         'duration' : this.options.duration,
         'easing'   : this.options.easing

   	  };
   	  $(currentFrame).animate({ top : move},options);
      $(nextFrame)
          .css({ top : -move})
          .show()
          .animate({ top : 0 },options);
   };    

    //一直向左滑动
   Tile.prototype.slideLeft= function(currentFrame,nextFrame){
   	/* body... */
      var move = this.size.width;
       var options = {
           'duration' : this.options.duration,
           'easing' : this.options.easing
       };
      $(currentFrame).animate({ left : -move }, options);
      $(nextFrame)
           .css({ left : move})
           .show()
           .animate({left : 0},options);
      
   }

   //一直向右滑动
   Tile.prototype.slideRight = function(currentFrame,nextFrame){
   	/* body... */
   	 var move = this.size.width;
   	 var options = {
   	 	  'duration' : this.options.duration,
   	 	  'easing'   : this.options.easing
   	 };
   	 $(currentFrame).animate({ left :move } , options);
   	 $(nextFrame)
   	      css({ left : -move})
   	      show()
   	      animate({ left : -move},options);
   }

   //插件定义
    var old = $.fn.tile;
    $.fn.tile = function(option){
        return this.each(function() {
          var $this = $(this);
          var data = $this.data('bs.tile')
          var options = $.extend({}, Tile.DEAFAULT, $this.data(),typeof option == 'obejct' && 'option');
          var a = toString(options);
          if(!data) 
          	{$this.data('bs.tile',(data = new Tile(this,options)));
             console.log('creat new tile'+options);}
          option === 'pause' ? data.pause() : data.start();

        })
    }

    //防冲突处理
    $.fn.tile.Constructor = Tile;
    $.fn.tile.noConflict = function(){
        $.fn.tile = old
        return this

    }

    //绑定触发事件
    $(window).on('load',function(){
          $('[data-toggle="tile"]').each(function(){
               $(this).tile();

          })



    })

}(window.jQuery);