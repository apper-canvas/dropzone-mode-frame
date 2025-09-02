import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const FilePreview = ({ file, className, ...props }) => {
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "Image";
    if (type === "application/pdf") return "FileText";
    if (type.includes("word") || type.includes("document")) return "FileText";
    if (type.includes("spreadsheet") || type.includes("excel")) return "Sheet";
    if (type.includes("presentation") || type.includes("powerpoint")) return "Presentation";
    if (type.startsWith("text/")) return "FileText";
    if (type.includes("json")) return "Code";
    if (type.includes("csv")) return "Database";
    return "File";
  };

  const getFileTypeLabel = (type) => {
    if (type.startsWith("image/")) return type.split("/")[1].toUpperCase();
    if (type === "application/pdf") return "PDF";
    if (type.includes("word")) return "DOCX";
    if (type.includes("excel")) return "XLSX";
    if (type.includes("powerpoint")) return "PPTX";
    if (type === "text/plain") return "TXT";
    if (type === "application/json") return "JSON";
    if (type === "text/csv") return "CSV";
    return "FILE";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success";
      case "uploading": return "primary";
      case "error": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const iconColor = file.type.startsWith("image/") ? "text-purple-400" : 
                   file.type === "application/pdf" ? "text-red-400" :
                   file.type.includes("word") ? "text-blue-400" :
                   "text-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center space-x-4 p-4 bg-surface border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-200",
        className
      )}
      {...props}
    >
      <div className={cn("w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center", iconColor)}>
        <ApperIcon name={getFileIcon(file.type)} className="w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0">
<h4 className="text-white font-medium text-sm truncate mb-1">{file.name}</h4>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
<span>{formatFileSize(file.size)}</span>
          <span>•</span>
          <Badge variant="default" size="sm">
            {getFileTypeLabel(file.type)}
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-col items-end space-y-1">
        <Badge variant={getStatusColor(file.status)} size="sm">
          {file.status === "uploading" && <ApperIcon name="Upload" className="w-3 h-3 mr-1" />}
          {file.status === "completed" && <ApperIcon name="Check" className="w-3 h-3 mr-1" />}
          {file.status === "error" && <ApperIcon name="X" className="w-3 h-3 mr-1" />}
          {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
        </Badge>
{file.uploadedAt && (
          <span className="text-xs text-gray-500">
            {new Date(file.uploadedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default FilePreview;