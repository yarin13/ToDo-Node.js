async function deleteBtn(id){
   try{
    await fetch(`/tasks/${id}`,{method: 'DELETE'});
    window.location.href = '/';
   }catch(error){
     console.log(error);
   }
}

