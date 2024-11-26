function showPicture(){
    const [file] = foodpicture.files
    fp.width = 60;
    fp.src = URL.createObjectURL(file)
}
console.error();
$(document).ready(function(){

    $.get('/food/fillcategory',function(response){

        response.data.map((item)=>{

            $('#categoryid').append($('<option>').text(item.categoryname).val(item.categoryid))

            
        })
    })

    $('#categoryid').change(function(){

        $.get('/food/fillsubcategory',{categoryid:$('#categoryid').val()},function(response){

            $('#subcategoryid').empty()
            $('#subcategoryid').append($('<option>').text('SUB-CATEGORY'))
            response.data.map((item)=>{
        
                $('#subcategoryid').append($('<option>').text(item.subcategoryname).val(item.subcategoryid))
            })

        })
    })


})