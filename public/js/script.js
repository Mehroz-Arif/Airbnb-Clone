(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
//   const checkEmpty = ()=>{

//   }

//   const allInput = getElementsByClassName("form-control");
//   allInput.map((ele,ind)=>{
//     const id = ele.id
//     let sibling = ele.nextElementSibling;
//     console.log(id,ind,sibling);
//   })