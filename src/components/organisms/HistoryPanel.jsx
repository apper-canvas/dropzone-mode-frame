import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const HistoryPanel = ({ 
  history = [], 
  loading = false,
  onReUpload
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "Image";
    if (type === "application/pdf") return "FileText";
    if (type.includes("document") || type.includes("word")) return "FileText";
    if (type.includes("spreadsheet") || type.includes("excel")) return "FileSpreadsheet";
    if (type.includes("presentation") || type.includes("powerpoint")) return "FilePresentation";
    if (type.startsWith("video/")) return "Video";
    if (type.startsWith("audio/")) return "Music";
    return "File";
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch {
      return "Unknown date";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!history || history.length === 0) {
    return (
      <Empty
        title="No upload history"
        message="Files you've successfully uploaded will appear here with download links and re-upload options."
        icon="History"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-gray-700 rounded-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Upload History</h2>
          <span className="text-sm text-gray-400">
            {history.length} file{history.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-3">
          {history.map((file, index) => (
            <motion.div
              key={file.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon 
name={getFileIcon(file.type)} 
                    className="w-5 h-5 text-primary"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-white truncate">
{file.name}
                    </p>
                    <div className="flex items-center space-x-1 text-success">
                      <ApperIcon name="CheckCircle" className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-xs text-gray-400">
{formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-gray-400">
{formatTimestamp(file.uploadedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
{file.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
link.href = file.url;
                      link.download = file.name;
                      link.click();
                    }}
                    className="p-2 h-8 w-8"
                    title="Download file"
                  >
                    <ApperIcon name="Download" className="w-4 h-4" />
                  </Button>
                )}
                
                {onReUpload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReUpload(file)}
                    className="p-2 h-8 w-8"
                    title="Re-upload this file"
                  >
                    <ApperIcon name="Upload" className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryPanel;