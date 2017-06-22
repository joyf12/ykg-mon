
$(function(){
	
	
	var flag = flag;
	//使用事件代理
	$('.container').click(function(e){
		//获取所有的行
		var rs = $('.row');
		//获取当前点击项的父元素
		var cc = $(e.target).parents('.row');
		//遍历
		for(var i=0;i<rs.length;i++){
			$(rs[i]).removeClass('active');
		}
		
		$(cc).addClass('active');
		// if(rs.length==1){
		// 	flag=false;
		// }else{
		// 	flag=true;
		// }
		flag=true;
	})

	//点击删除
	$('.rem').click(function(){

		//删除含有active类名的行
		if(flag){
			//获取所有的行
			var rs = $('.row');
			for(var i = 1;i<rs.length;i++){
				
				if($(rs[i]).hasClass('active')){
					rs.splice(i,1);
					i--;
					$('.active').remove();
				}
			}
			$('.count').text(rs.length-1);
			price=0;
			for(var j=0;j<rs.length;j++){
				price+=Number($(rs[j]).find('.pri').text());
			}
			price=Number(price)
			price = price.toFixed(2);
			$('.price').text(price);
		}else{
			alert('请选择需要删除的商品');
		}		
	})
	//监听是否点击Enter键
	var price=0;//定义商品总价
	var arr = [];//定义数组用来存储商品信息
	var barcodes = [];//定义数组存储条码
	// var $ipts = $('input');
	var c =0;
	$('input').keypress(function(e){
		// console.log($(this).val())
		var ipt = e.target;
		var barcode = '';
		var key = e.which;
		if(key==13){
			c+=1;
			if(c!=1){
				return;
			}
			//获取输入的条码
			barcode = Number($(this).val());
			console.log(barcode)
			barcodes.push(barcode);
			$.post({
				url:'http://api.zdsh365.com/ykg/index.php/home/Print/searchgoods',
				headers:{
		          'Content-Type':'application/x-www-form-urlencoded',
		          'Accept': '*/*'
		        },
				data:{barcode:barcode},
				success:function(data){
					// console.log(data)
					data=JSON.parse(data);
					if(data.error){
						//执行完之后清空输入框
						$(ipt).val('')
						alert(data.error);
						barcode='';
						c=0;
						return;
					}
					var result = data.ok;
					arr.push(result);
					$('<div class="row"><div class="col-xs-3 col-sm-3 col-md-3"><p>'
						+result.barcode+'</p></div><div class="col-xs-4 col-sm-4 col-md-4"><p>'
						+result.name+'</p></div><div class="col-xs-1 col-sm-1 col-md-1"><p>'
						+result.price+'</p></div><div class="col-xs-1 col-sm-1 col-md-1"><p>'
						+result.discount+'</p></div><div class="col-xs-1 col-sm-1 col-md-1"><p>'
						+result.number+'</p></div><div class="col-xs-1 col-sm-1 col-md-1"><p>'
						+result.nowprice+'</p></div><div class="col-xs-1 col-sm-1 col-md-1"><p class="pri">'
						+result.totalmoney+'</p></div></div>').appendTo('.container')
					
					//执行完之后清空输入框
					$(ipt).val('')
					//获取到页面所有商品
					var coms = $('.row');
					price=0;
					for(var i=1;i<coms.length;i++){
						// console.log($(coms[i]).find('.pri').text())
						price+=Number($(coms[i]).find('.pri').text());
						
					}
					price=Number(price)
					price = price.toFixed(2);
					$('.price').text(price);
					$('.count').text(coms.length-1);//商品数量合计
					c=0;
					// arr.push(result);
					// arr.push(result);
					// console.log(arr)
					// var html = template('Menu',arr);
					// $('.container').html(html);

				}
			})
		}	
	})

	//结算
	$('.set').click(function(){
		// if(arr.length==0){
		// 	alert('请输入商品条码');
		// 	return;
		// }
		
		barcodes = barcodes.join();
		console.log(barcodes)
		if(price==0){
			alert('请确认是否有需要付款的商品');
			return;
		}
		$.get({
				headers:{
					'Content-Type':'application/x-www-form-urlencoded',
		          	'Accept': '*/*'
				},
				url:'http://localhost/ykg/index.php/home/Print/startprint',
				data:{barcode:barcodes},
				success:function(data){
					console.log(data);
					alert('结算成功')
				}
			})
		//结算完成清空页面
		var coms = $('.row');
		for(var i=1;i<coms.length;i++){
			$(coms[i]).remove();
		}
		$('.price').text(0);
		$('.count').text(0);
		arr=[];
		// $.ajax({
		// 	type:'post',
		// 	headers:{
		//           'Content-Type':'application/x-www-form-urlencoded',
		//           'Accept': '*/*'
		//         },
		// 	url:'http://api.zdsh365.com/ykg/index.php/home/Print/startprint',
		// 	data:{barcode:barcodes},
		// 	success:function(data){
		// 		console.log('付款成功')
		// 	}
		// })
	})

	!function(){
		//alert($(window).height()-155)
		$('.container:eq(0)').css('height',$(window).height()-155-180);
	}();
})




