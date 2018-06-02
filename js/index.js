;(function(){

	var Dialog = function(config){
		var  _this_ = this;
		//默认参数配置
		this.config = {
			//对话框的宽
			width:"auto",
			//对话框的高
			height:'auto',
			//对话框的提示信息
			message:null,
			//对话框类型
			type:null,
			//按钮配置
			buttons:null,
			//弹出框延迟多久关闭
			delay:null,
			//延时关闭回调函数
			delayCallback:null,
			//对话框遮罩透明度
			maskOpacity:null,
			//是否启用动画
			effect:false,
			//指定遮罩层点击是否可以关闭
			maskClose:false
		};
		//默认参数扩展
		if(config && $.isPlainObject(config)){
			$.extend(this.config,config);
		}else{
			this.isConfig = true;
		}
		// console.log(this.config);
		//创建基本的DOM
		this.body = $('body');
		//创建遮罩层
		this.mask = $('<div class="g-dialog-container">');
		//创建弹出框
		this.win = $('<div class="dialog-window">');
		//创建弹出框头部
		this.winHeader = $('<div class="dialog-header">');
		//创建弹出框提示信息
		this.winContent = $('<div class="dialog-content">');
		//创建弹出框按钮区
		this.winFooter = $('<div class="dialog-footer">');
		//渲染Dom
		this.creat();
		
	};
	//记录弹框层级
	Dialog.zIndex = 10000;
	Dialog.prototype = {
		//动画
		animate : function(){
			var _this_ = this;
			this.win.css('-webkit-transform','scale(0,0)');
			window.setTimeout(function(){
				_this_.win.css('-webkit-transform','scale(1,1)');
			}, 100);
			
		},
		//创建弹出框
		creat : function(){
			var _this_ = this,
				config = this.config,
				mask = this.mask,
				win = this.win,
				header = this.winHeader,
				content = this.winContent,
				footer = this.winFooter,
				body = this.body;
			//增加弹框层级
			Dialog.zIndex++;
			mask.css('zIndex',Dialog.zIndex);
			//如果没有传递任何配置参数，就弹出一个等待的图标形式的弹框
			if(this.isConfig){
				header.append('<span class="icon icon-loading"></span>');
				win.append(header);
				if (config.effect) {
					this.animate();
				};
				mask.append(win);
				body.append(mask);
			}else{
				//根据配置参数创建相应的弹框
				if(config.type){
					switch (config.type){
						case 'warn':
							header.append('<span class="icon icon-warn"></span>');
						break;
						case 'ok':
							header.append('<span class="icon icon-ok"></span>');
						break;
						case 'loading':
							header.append('<span class="icon icon-loading"></span>');
						break;
					}
					win.append(header);
				}
				
				//如果传了信息文本
				if(config.message){
					win.append(content.html(config.message));
				}
				//按钮组
				if(config.buttons){
					this.creatButtons(footer,config.buttons);
					win.append(footer);
				}
				//插入到页面
				mask.append(win);
				body.append(mask);
				//设置对话框的宽高
				if(config.width != 'auto'){
					win.width(config.width);
				}
				if(config.height != 'auto'){
					win.height(config.height);
				}
				//对话框遮罩透明度
				if(config.maskOpacity){
					mask.css('backgroundColor','rgba(0,0,0,' + config.maskOpacity + ')');
				}
				//对话框弹出后多久关闭
				if(config.delay && config.delay != 0){
					window.setTimeout(function(){
						_this_.close();
						//执行延时的回调函数
						config.delayCallback && config.delayCallback();
					},config.delay);

				}
				if (config.effect) {
					this.animate();
				};
				//指定遮层点击是否关闭
				if(config.maskClose){
					mask.tap(function(){
						_this_.close();
					})
				}
			}
		},
		creatButtons : function(footer,buttons){
			// console.log(buttons);
			var _this_ = this;
			$(buttons).each(function(i){
				//获取按钮样式、回调、文本
				var type = this.type ? this.type : '';
				var btnText = this.text ? this.text : '按钮'+(++i);
				var callback = this.callback ? this.callback : null;
				var button = $('<button class="btn '+type+'">'+btnText+'</button>');
				if(callback){
					button.tap(function(e){
						var isClose = callback();
						//阻止事件冒泡
						e.stopPropagation();
						if(isClose != false){
							_this_.close();
						}
						
					});
				}else{
					button.tap(function(e){
						e.stopPropagation();
						//e.preventDefault();
						_this_.close();
					});
				}
				footer.append(button);
			});
		},
		close : function(){
			this.mask.remove();

		}
	};
	window.Dialog = Dialog;
	$.dialog = function(config){
		return new Dialog(config);
	}

})(Zepto);