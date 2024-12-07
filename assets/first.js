const name = document.querySelector("#courseName");
const category = document.querySelector("#courseCategory");
const price = document.querySelector("#coursePrice");
const description = document.querySelector("#courseDescription");
const capacity = document.querySelector("#courseCapacity");
const add = document.querySelector("#click");
const del = document.querySelector("#deleteBtn");
const invalidn = document.querySelector(".invalidn");
const invalidc = document.querySelector(".invalidc");
const invalidp = document.querySelector(".invalidp");
const invalidd = document.querySelector(".invalidd");
const invalidcap = document.querySelector(".invalidcap");
const search = document.querySelector("#search");
const upd = document.querySelector("#upd");
const clearo = document.querySelector("#clearo");
let courses = [];
if(localStorage.getItem("courses") != null){
    courses = JSON.parse(localStorage.getItem("courses"));
    display();
}

let isValid = true;
const npattern = /^[A-Z][a-z]{2,9}$/; 
const cpattern = /^[A-Z][a-z]{2,3}$/; 
const ppattern = /^[0-9]{1,3}$/;    
const dpattern = /^[A-Z][a-z]{2,99}$/; 
const cappattern = /^[0-9]{1,2}$/;   

name.addEventListener("input", () => {
    if (!npattern.test(name.value)) {
        name.classList.add("is-invalid");
        invalidn.innerHTML = "The name is invalid. It must start with a capital letter & contain 3-10 small letters.";
        isValid = false;
    } else {
        invalidn.innerHTML = "";
        name.classList.remove("is-invalid");
        name.classList.add("is-valid");
        isValid = true; 
    }
});

category.addEventListener("input", () => {
    if (!cpattern.test(category.value)) {
        category.classList.add("is-invalid");
        invalidc.innerHTML = "The category is invalid. It must start with a capital letter & contain 3-4 small letters.";
        isValid = false;
    } else {
        invalidc.innerHTML = "";
        category.classList.remove("is-invalid");
        category.classList.add("is-valid");
        isValid = true;
    }
});

price.addEventListener("input", () => {
    if (!ppattern.test(price.value)) {
        price.classList.add("is-invalid");
        invalidp.innerHTML = "The price is invalid. It must be a number from 0-999.";
        isValid = false;
    } else {
        invalidp.innerHTML = "";
        price.classList.remove("is-invalid");
        price.classList.add("is-valid");
        isValid = true;
    }
});

description.addEventListener("input", () => {
    if (!dpattern.test(description.value)) {
        description.classList.add("is-invalid");
        invalidd.innerHTML = "The description is invalid. It must start with a capital letter & contain 3-100 small letters.";
        isValid = false;
    } else {
        invalidd.innerHTML = "";
        description.classList.remove("is-invalid");
        description.classList.add("is-valid");
        isValid = true;
    }
});

capacity.addEventListener("input", () => {
    if (!cappattern.test(capacity.value)) {
        capacity.classList.add("is-invalid");
        invalidcap.innerHTML = "The capacity is invalid. It must be a number from 0-99.";
        isValid = false;
    } else {
        invalidcap.innerHTML = "";
        capacity.classList.remove("is-invalid");
        capacity.classList.add("is-valid");
        isValid = true;
    }
});

add.addEventListener("click", (e) => {
    e.preventDefault();
    if (isValid) {
        const course = {
            name: name.value,
            category: category.value,
            price: price.value,
            description: description.value,
            capacity: capacity.value,
        };
        let courses = JSON.parse(localStorage.getItem("courses")) || [];
        courses.push(course);
        localStorage.setItem("courses", JSON.stringify(courses));
        
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "Course added successfully"
        });

        display();
    }
    
});

clearo.addEventListener("click",(e) => {
    name.value = "";
    category.value = "";
    price.value = "";
    description.value = "";
    capacity.value = "";
})
search.addEventListener("input",(e) => {
    e.preventDefault();
    const keyw = search.value;
    const s = courses.filter((course) => {
        return course.name.toLowerCase().includes(keyw.toLowerCase());
    })
    const result = s.map ((course,index)=>{
        return `
        <tr>
        <td>${index+1}</td>
        <td>${course.name}</td>
        <td>${course.category}</td>
        <td>${course.price}</td>
        <td>${course.description}</td>
        <td>${course.capacity}</td>
        <td>
        <button class="btn btn-success" onclick ="updatecourse(${index})">edit</button>
        </td>
        <td> 
        <button class="btn btn-danger" onclick ="deletcourse(${index})">delete</button>
        </td>
        </tr>
        `;
    }).join(' ');
    document.querySelector("#data").innerHTML=result;
})
function updatecourse(index){
    name.value = courses[index].name;
    category.value = courses[index].category;
    price.value = courses[index].price;
    description.value = courses[index].description;
    capacity.value = courses[index].capacity;

    upd.addEventListener("click",(e) => {
            let courses = JSON.parse(localStorage.getItem("courses")) || [];
            courses[index].name=name.value;
            courses[index].category=category.value;
            courses[index].price= price.value;
            courses[index].description=description.value;
            courses[index].capacity=capacity.value;
            localStorage.setItem("courses", JSON.stringify(courses));
            display();
        
    })
}
del.addEventListener("click",(e) => {
    e.preventDefault();
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete All!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            courses=[];
    localStorage.setItem("courses",JSON.stringify(courses));
    display();
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error"
          });
        }
      });
})

function display() {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const result = courses.map ((course,index)=>{
        return `
        <tr>
        <td>${index+1}</td>
        <td>${course.name}</td>
        <td>${course.category}</td>
        <td>${course.price}</td>
        <td>${course.description}</td>
        <td>${course.capacity}</td>
        <td>
        <button class="btn btn-success" onclick ="updatecourse(${index})">edit</button>
        </td>
        <td> 
        <button class="btn btn-danger" onclick ="deletcourse(${index})">delete</button>
        </td>
        </tr>
        `;
    }).join(' ');
    document.querySelector("#data").innerHTML=result;
}

function deletcourse(index){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            courses.splice(index,1);
    localStorage.setItem("courses",JSON.stringify(courses));
    display();
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error"
          });
        }
      });
    
}
