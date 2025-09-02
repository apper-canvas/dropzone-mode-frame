const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient for database operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const uploadService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('upload_c', params);
      
      if (!response.success) {
        console.error("Error fetching uploads:", response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database field names to component field names
      return response.data.map(upload => ({
        Id: upload.Id,
        name: upload.name_c,
        size: upload.size_c,
        type: upload.type_c,
        status: upload.status_c,
        progress: upload.progress_c,
        uploadedAt: upload.uploaded_at_c,
        url: upload.url_c
      }));
    } catch (error) {
      console.error("Error fetching uploads:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('upload_c', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || `Upload with ID ${id} not found`);
      }
      
      if (!response.data) {
        throw new Error(`Upload with ID ${id} not found`);
      }
      
      // Map database field names to component field names
      return {
        Id: response.data.Id,
        name: response.data.name_c,
        size: response.data.size_c,
        type: response.data.type_c,
        status: response.data.status_c,
        progress: response.data.progress_c,
        uploadedAt: response.data.uploaded_at_c,
        url: response.data.url_c
      };
    } catch (error) {
      console.error(`Error fetching upload ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(uploadData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          name_c: uploadData.name,
          size_c: uploadData.size,
          type_c: uploadData.type,
          status_c: uploadData.status || "pending",
          progress_c: uploadData.progress || 0,
          uploaded_at_c: uploadData.uploadedAt,
          url_c: uploadData.url
        }]
      };
      
      const response = await apperClient.createRecord('upload_c', params);
      
      if (!response.success) {
        console.error("Error creating upload:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create upload: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          // Map database field names back to component field names
          return {
            Id: created.Id,
            name: created.name_c,
            size: created.size_c,
            type: created.type_c,
            status: created.status_c,
            progress: created.progress_c,
            uploadedAt: created.uploaded_at_c,
            url: created.url_c
          };
        }
      }
      
      throw new Error("Failed to create upload record");
    } catch (error) {
      console.error("Error creating upload:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: updateData.name,
          size_c: updateData.size,
          type_c: updateData.type,
          status_c: updateData.status,
          progress_c: updateData.progress,
          uploaded_at_c: updateData.uploadedAt,
          url_c: updateData.url
        }]
      };
      
      const response = await apperClient.updateRecord('upload_c', params);
      
      if (!response.success) {
        console.error("Error updating upload:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update upload: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          // Map database field names back to component field names
          return {
            Id: updated.Id,
            name: updated.name_c,
            size: updated.size_c,
            type: updated.type_c,
            status: updated.status_c,
            progress: updated.progress_c,
            uploadedAt: updated.uploaded_at_c,
            url: updated.url_c
          };
        }
      }
      
      throw new Error("Failed to update upload record");
    } catch (error) {
      console.error("Error updating upload:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('upload_c', params);
      
      if (!response.success) {
        console.error("Error deleting upload:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete upload: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting upload:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async simulateUpload(id, onProgress) {
    try {
      // First get the current upload record
      const upload = await this.getById(id);
      if (!upload) {
        throw new Error(`Upload with ID ${id} not found`);
      }

      // Simulate upload progress with database updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await delay(150);
        
        // Update progress in database
        const updatedUpload = await this.update(id, {
          ...upload,
          progress: progress,
          status: "uploading"
        });
        
        if (onProgress) {
          onProgress(progress);
        }
      }

      // Mark as completed with final update
      const finalUpload = await this.update(id, {
        ...upload,
        status: "completed",
        progress: 100,
        url: `/uploads/${upload.name}`,
        uploadedAt: new Date().toISOString()
      });

      return finalUpload;
    } catch (error) {
      console.error(`Error simulating upload ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async validateFile(file) {
    await delay(100);
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
      "application/json"
    ];

    if (file.size > maxSize) {
      throw new Error(`File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type "${file.type}" is not allowed. Supported types: images, PDF, Word documents, text files.`);
    }

    return true;
  },

  // Upload session methods
  async createSession(files) {
    try {
      const apperClient = getApperClient();
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      const params = {
        records: [{
          files_c: files.map(f => f.Id).join(','),
          total_size_c: totalSize,
          started_at_c: new Date().toISOString(),
          completed_at_c: null
        }]
      };
      
      const response = await apperClient.createRecord('upload_session_c', params);
      
      if (!response.success) {
        console.error("Error creating session:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0 && response.results[0].success) {
        const session = response.results[0].data;
        return {
          Id: session.Id,
          files: session.files_c ? session.files_c.split(',').map(id => parseInt(id)) : [],
          totalSize: session.total_size_c,
          startedAt: session.started_at_c,
          completedAt: session.completed_at_c
        };
      }
      
      throw new Error("Failed to create upload session");
    } catch (error) {
      console.error("Error creating session:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async completeSession(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          completed_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.updateRecord('upload_session_c', params);
      
      if (!response.success) {
        console.error("Error completing session:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0 && response.results[0].success) {
        const session = response.results[0].data;
        return {
          Id: session.Id,
          files: session.files_c ? session.files_c.split(',').map(id => parseInt(id)) : [],
          totalSize: session.total_size_c,
          startedAt: session.started_at_c,
          completedAt: session.completed_at_c
        };
      }
      
      throw new Error("Failed to complete upload session");
    } catch (error) {
      console.error("Error completing session:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getHistory() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}}
        ],
        where: [
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["completed"]},
          {"FieldName": "uploaded_at_c", "Operator": "HasValue", "Values": [""]}
        ],
        orderBy: [{"fieldName": "uploaded_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('upload_c', params);
      
      if (!response.success) {
        console.error("Error fetching upload history:", response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database field names to component field names
      return response.data.map(upload => ({
        Id: upload.Id,
        name: upload.name_c,
        size: upload.size_c,
        type: upload.type_c,
        status: upload.status_c,
        progress: upload.progress_c,
        uploadedAt: upload.uploaded_at_c,
        url: upload.url_c
      }));
    } catch (error) {
      console.error("Error fetching upload history:", error?.response?.data?.message || error.message);
      return [];
    }
  }
};