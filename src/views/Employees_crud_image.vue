<template>
    <div class="container mt-4">
      <h2 class="mb-3">รายการพนักงาน</h2>
  
  
      <table class="table table-bordered table-striped">
        <thead class="table-primary">
          <tr>
          <th>ID</th>
          <th>ชื่อ-นามสกุล</th>
          <th>แผนก</th>
          <th>เงินเดือน</th>
          <th>สถานะ</th>
          <th>รูปภาพ</th>
          <th>แก้ไข/ลบ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employees in employees" :key="employees.emp_id">
            <td>{{ employees.emp_id }}</td>
            <td>{{ employees.full_name }}</td>
            <td>{{ employees.department }}</td>
            <td>{{ employees.salary }}</td>
            <td>{{ employees.active }}</td>
            <td>
              <img
                v-if="employees.image"
                :src="'http://localhost/App-vue01/php_api/uploads/' + employees.image"
                width="100"
              />
            </td>
            <td>
              <button class="btn btn-warning btn-sm me-2" @click="openEditModal(employees)">
                แก้ไข
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteEmployees(employees.emp_id)">
                ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
  
      <div class="mb-3 text-end">
        <button class="btn btn-primary" @click="openAddModal">Add+</button>
      </div>
  
      <div v-if="loading" class="text-center"><p>กำลังโหลดข้อมูล...</p></div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
  
      <!-- Modal ใช้ทั้งเพิ่ม / แก้ไข -->
      <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog modal-md">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditMode ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่" }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveEmployees">
                <div class="mb-3">
                  <label class="form-label">ชื่อพนักงาน</label>
                  <input v-model="editForm.full_name" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">แผนก</label>
                  <textarea v-model="editForm.department" class="form-control"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">เงินเดือน</label>
                  <input v-model="editForm.salary" type="number" step="0.01" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">สถานะ</label>
                  <input v-model="editForm.active" type="number" class="form-control" required />
                </div>
                <div class="mb-3">
    <label class="form-label">รูปภาพ</label>
    <!-- ✅ required เฉพาะตอนเพิ่มสินค้า -->
    <input
      type="file"
      @change="handleFileUpload"
      class="form-control"
      :required="!isEditMode"
    />
  
    <!-- แสดงรูปเดิมเฉพาะตอนแก้ไข -->
    <div v-if="isEditMode && editForm.image">
      <p class="mt-2">รูปเดิม:</p>
      <img
        :src="'http://localhost/App-vue01/php_api/uploads/' + editForm.image"
        width="100"
      />
    </div>
  </div>
  
  
  
  
                <button type="submit" class="btn btn-success">
                  {{ isEditMode ? "บันทึกการแก้ไข" : "บันทึกพนักงานใหม่" }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    
  </template>
  

  
  <script>
  import { ref, onMounted } from "vue";
  
  export default {
    name: "EmployeesList",
    setup() {
      const employees = ref([]);
      const loading = ref(true);
      const error = ref(null);
      const isEditMode = ref(false); // ✅ เช็คโหมด
      const editForm = ref({
        emp_id: null,
        full_name: "",
        department: "",
        salary: "",
        active: "",
        image: ""
      });
      const newImageFile = ref(null);
      let modalInstance = null;
  
      // โหลดข้อมูลสินค้า
      const fetchEmployees = async () => {
        try {
          const res = await fetch("http://localhost/App-vue01/php_api/api_employees.php");
          const data = await res.json();
          employees.value = data.success ? data.data : [];
        } catch (err) {
          error.value = err.message;
        } finally {
          loading.value = false;
        }
      };
  
  // เปิด Modal สำหรับเพิ่มพนักงาน
  const openAddModal = () => {
    isEditMode.value = false;
    editForm.value = {
        emp_id: null,
        full_name: "",
        department: "",
        salary: "",
        active: "",
        image: ""
    };
    newImageFile.value = null;
        
    const modalEl = document.getElementById("editModal");
    modalInstance = new window.bootstrap.Modal(modalEl);
    modalInstance.show();
  
    // ✅ รีเซ็ตค่า input file ให้ไม่แสดงชื่อไฟล์ค้าง
    const fileInput = modalEl.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
   };
  
  // เปิด Modal สำหรับแก้ไขสินค้า
      const openEditModal = (employee) => {
        isEditMode.value = true;
        editForm.value = { ...employee };
        newImageFile.value = null;
        const modalEl = document.getElementById("editModal");
        modalInstance = new window.bootstrap.Modal(modalEl);
        modalInstance.show();
      };
  
      const handleFileUpload = (event) => {
        newImageFile.value = event.target.files[0];
      };

  // ✅ ใช้ฟังก์ชันเดียวในการเพิ่ม / แก้ไข
      const saveEmployees = async () => {
        const formData = new FormData();
        formData.append("action", isEditMode.value ? "update" : "add");
        if (isEditMode.value) formData.append("emp_id", editForm.value.emp_id);
        formData.append("full_name", editForm.value.full_name);
        formData.append("department", editForm.value.department);
        formData.append("salary", editForm.value.salary);
        formData.append("active", editForm.value.active);
        if (newImageFile.value) formData.append("image", newImageFile.value);
  
        try {
          const res = await fetch("http://localhost/App-vue01/php_api/api_employees.php", {
            method: "POST",
            body: formData
          });
          const result = await res.json();
          if (result.message) {
            alert(result.message);
            fetchEmployees();
            modalInstance.hide();
          } else if (result.error) {
            alert(result.error);
          }
        } catch (err) {
          alert(err.message);
        }
      };
  
      // ลบพนักงาน
      const deleteEmployees = async (id) => {
        if (!confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?")) return;
  
        const formData = new FormData();
        formData.append("action", "delete");
        formData.append("emp_id", id);
  
        try {
          const res = await fetch("http://localhost/App-vue01/php_api/api_employees.php", {
            method: "POST",
            body: formData
          });
          const result = await res.json();
          if (result.message) {
            alert(result.message);
            employees.value = employees.value.filter((p) => p.emp_id !== id);
          } else if (result.error) {
            alert(result.error);
          }
        } catch (err) {
          alert(err.message);
        }
      };
  
      onMounted(fetchEmployees);
  
      return {
        employees,
        loading,
        error,
        editForm,
        isEditMode,
        openAddModal,
        openEditModal,
        handleFileUpload,
        saveEmployees,
        deleteEmployees
      };
    }
  };
  </script>