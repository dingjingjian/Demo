//选择图片，马上预览  
    function xmTanUploadImg(obj) {  

        var fl=obj.files.length;  
        for(var i=0;i<fl;i++){  
            var file=obj.files[i];  
            var reader = new FileReader();  

            //读取文件过程方法  
            reader.onload = function (e) {  
                var imgstr='<img  src="'+e.target.result+'"/ onClick="removeinputFile(this)">';  
                var oimgbox=$("#images");  
                oimgbox.append(imgstr);  

            }  

            reader.readAsDataURL(file);   
        }  

    }  
    // 提交 
    function uploadFile() {
        //看最后一个file类型的input是否有文件，没有则移除
        if($("input[type='file']:last").prop('files')){
            if($(":file").prop('files').length==0){
                $("input[type='file']:last").remove();
                if($("input[type='file']").length==0){
                    alert("请选择图片");
                }
            }

            var form = new FormData($("#uploadForm")[0]);
            $.ajax({
                type:"post",
                url:"./a",//根据自己项目的需要写请求地址
                data:form,
                processData:false,
                contentType:false,
                success:function(msg){
                    console.log(msg);
                },
                error:function(e){
                    console.log(e.responseText);
                }
            })
        }else{
            alert("请选择图片");
            }
    }  
//新增type="file"
function addinputFile(){
    //检查最后一个type="file"有没有选择图片，没有则去使用，不再建新的
    var lastObj=$("input[type='file']:last");
    if(lastObj.prop('files')){
        if(lastObj.prop('files').length==0){
            lastObj.click();
        }else{
            $(".inputFiles").append("<input type='file' name='fileAttach'  multiple='multiple' accept='image/*' onChange='xmTanUploadImg(this);' />");
            $("input[type='file']:last").click();  
            }
    }else{
        //第一个
        $(".inputFiles").append("<input type='file' name='fileAttach'  multiple='multiple' accept='image/*' onChange='xmTanUploadImg(this);' />");
        $("input[type='file']:last").click();
    }
}
//删除图片
function removeinputFile(obj){    
    $("input[type='file']").eq(($(obj).index()-1)).remove();
    $(obj).remove();
}