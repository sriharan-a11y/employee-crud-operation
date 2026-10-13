const apiUrl = "https://jsonplaceholder.typicode.com/users"
let editId = null;
let employees = [];
const showForm = () => {
    document.getElementById("employeeForm").style.display = "block";
} 
const hideForm = () => {
   document.getElementById("employeeForm").style.display = "none";
}
const addEmployee = async () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
const response = await fetch(apiUrl,{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        name:name,
        email:email
    })
})
const newEmployee = await response.json()
employees.push(newEmployee);
    displayEmployees();
    hideForm();
}
const updateEmployee = async () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const existingResponse = await fetch(`${apiUrl}/${editId}`);
    if (!existingResponse.ok) {
        alert("This employee no longer exists on the server. Refresh the page and try again.");
        return;
    }
    const existingEmployee = await existingResponse.json();
    const response = await fetch(`${apiUrl}/${editId}`,{
        method :"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            id:existingEmployee.id,
            name:name,
            email:email
        })
    })
    if (!response.ok) {
        throw new Error(`Unable to update employee (${response.status} ${response.statusText})`);
    }
    const updatedEmployee = await response.json();
    employees = employees.map(function(employee){
        if  (employee.id == editId){
            return updatedEmployee;
        }
        return employee;
    }) 
    displayEmployees();
   hideForm();
}
const saveEmployee = () => {
    if (editId === null) {
        addEmployee();
    } else {
        updateEmployee();
    }
}
const displayEmployees = () => {
    const table = document.getElementById("employeeTable");
    table.innerHTML = "";
    employees.forEach(function (employee, index) {
        table.innerHTML +=`
<tr>
<td> ${index + 1} </td>
<td> ${employee.name} </td>
<td> ${employee.email} </td>
<td><button class = "btn btn-sm btn-primary"onclick = "editEmployee(${employee.id})">Edit</button>
<button class = "btn btn-sm btn-danger" onclick = "deleteEmployee(${employee.id})">Delete</button></td></tr>
`})
}
async function getEmployees() {
    const response = await fetch(apiUrl);
    employees = await response.json();
    displayEmployees();
}
const editEmployee = (id) => {
    const employee = employees.find(function (item) {
        return item.id === id;
    });
    document.getElementById("employeeForm").style.display = "block";
    document.getElementById("name").value = employee.name;
    document.getElementById("email").value = employee.email;
    editId = id;
}  
const deleteEmployee = async(id) => {
await fetch(`${apiUrl}/${id}`,{
    method:"DELETE"
}); 
    employees = employees.filter(function (employee) {
        return employee.id !== id;
    })
    displayEmployees();
}
getEmployees();