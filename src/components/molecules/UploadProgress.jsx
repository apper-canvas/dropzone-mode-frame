import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "@/components/atoms/ProgressBar";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const UploadProgress = ({ 
  file, 
  onCancel, 
  onRemove, 
  className,
  ...props 
}) => {
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "Image";
    if (type === "application/pdf") return "FileText";
    if (type.includes("word") || type.includes("document")) return "FileText";
    return "File";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getProgressVariant = () => {
    if (file.status === "error") return "error";
    if (file.status === "completed") return "success";
    return "primary";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "bg-surface border border-gray-700 rounded-xl p-4 space-y-3",
        file.status === "error" && "border-red-500/50",
        file.status === "completed" && "border-green-500/50",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
            <ApperIcon 
              name={getFileIcon(file.type)} 
              className={cn(
                "w-5 h-5",
                file.type.startsWith("image/") ? "text-purple-400" :
                file.type === "application/pdf" ? "text-red-400" :
                "text-gray-400"
              )}
            />
          </div>
          
          <div className="flex-1 min-w-0">
<h4 className="text-white font-medium text-sm truncate">{file.name}</h4>
            <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {file.status === "uploading" && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancel(file.Id)}
              className="p-1 h-8 w-8"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          )}
          
{file.status === "completed" && file.url && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const link = document.createElement('a');
                link.href = file.url;
                link.download = file.name;
                link.click();
              }}
              className="p-1 h-8 w-8"
              title="Download file"
            >
              <ApperIcon name="Download" className="w-4 h-4" />
            </Button>
          )}
          
          {(file.status === "completed" || file.status === "error") && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(file.Id)}
              className="p-1 h-8 w-8"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {file.status === "uploading" && (
        <div className="space-y-2">
          <ProgressBar
            value={file.progress}
            variant={getProgressVariant()}
            size="md"
            showLabel={true}
          />
          <p className="text-xs text-gray-400">
            Uploading... {file.progress}% complete
          </p>
        </div>
      )}

      {file.status === "completed" && (
        <div className="flex items-center space-x-2 text-success text-sm">
          <ApperIcon name="CheckCircle" className="w-4 h-4" />
          <span>Upload completed successfully</span>
        </div>
      )}

      {file.status === "error" && (
        <div className="flex items-center space-x-2 text-error text-sm">
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          <span>Upload failed - please try again</span>
        </div>
      )}
    </motion.div>
  );
};

export default UploadProgress;