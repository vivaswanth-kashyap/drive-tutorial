"use client";

import React, { useState } from "react";
import {
  Folder,
  File,
  Upload,
  ArrowLeft,
  Grid,
  List,
  Search,
  ChevronRight,
} from "lucide-react";

// Mock data structure
const initialData = {
  root: {
    id: "root",
    name: "My Drive",
    type: "folder",
    parentId: null,
    children: ["folder1", "folder2", "file1", "file2", "file3"],
  },
  folder1: {
    id: "folder1",
    name: "Documents",
    type: "folder",
    parentId: "root",
    children: ["folder3", "file4", "file5"],
  },
  folder2: {
    id: "folder2",
    name: "Photos",
    type: "folder",
    parentId: "root",
    children: ["file6", "file7"],
  },
  folder3: {
    id: "folder3",
    name: "Work Projects",
    type: "folder",
    parentId: "folder1",
    children: ["file8", "file9"],
  },
  file1: {
    id: "file1",
    name: "Resume.pdf",
    type: "file",
    parentId: "root",
    fileType: "pdf",
    size: "256 KB",
    modified: "Mar 15, 2025",
    url: "/files/resume.pdf",
  },
  file2: {
    id: "file2",
    name: "Budget.xlsx",
    type: "file",
    parentId: "root",
    fileType: "xlsx",
    size: "1.2 MB",
    modified: "Mar 20, 2025",
    url: "/files/budget.xlsx",
  },
  file3: {
    id: "file3",
    name: "Presentation.pptx",
    type: "file",
    parentId: "root",
    fileType: "pptx",
    size: "3.5 MB",
    modified: "Mar 22, 2025",
    url: "/files/presentation.pptx",
  },
  file4: {
    id: "file4",
    name: "Contract.docx",
    type: "file",
    parentId: "folder1",
    fileType: "docx",
    size: "420 KB",
    modified: "Mar 10, 2025",
    url: "/files/contract.docx",
  },
  file5: {
    id: "file5",
    name: "Notes.txt",
    type: "file",
    parentId: "folder1",
    fileType: "txt",
    size: "12 KB",
    modified: "Mar 5, 2025",
    url: "/files/notes.txt",
  },
  file6: {
    id: "file6",
    name: "Vacation.jpg",
    type: "file",
    parentId: "folder2",
    fileType: "jpg",
    size: "2.3 MB",
    modified: "Feb 28, 2025",
    url: "/files/vacation.jpg",
  },
  file7: {
    id: "file7",
    name: "Family.png",
    type: "file",
    parentId: "folder2",
    fileType: "png",
    size: "1.8 MB",
    modified: "Mar 1, 2025",
    url: "/files/family.png",
  },
  file8: {
    id: "file8",
    name: "Project Plan.pdf",
    type: "file",
    parentId: "folder3",
    fileType: "pdf",
    size: "780 KB",
    modified: "Mar 18, 2025",
    url: "/files/project-plan.pdf",
  },
  file9: {
    id: "file9",
    name: "Meeting Minutes.docx",
    type: "file",
    parentId: "folder3",
    fileType: "docx",
    size: "156 KB",
    modified: "Mar 19, 2025",
    url: "/files/meeting-minutes.docx",
  },
};

// Helper function to get file icon
const getFileIcon = (fileType: string): string => {
  switch (fileType) {
    case "pdf":
      return "📄";
    case "docx":
    case "doc":
      return "📝";
    case "xlsx":
    case "xls":
      return "📊";
    case "pptx":
    case "ppt":
      return "📑";
    case "jpg":
    case "png":
    case "gif":
      return "🖼️";
    case "txt":
      return "📃";
    default:
      return "📄";
  }
};

interface PathItem {
  id: string;
  name: string;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  parentId: string;
  fileType?: string;
  size?: string;
  modified?: string;
  url?: string;
  children?: string[];
}

export default function Page() {
  const [data] = useState(initialData);
  const [currentFolder, setCurrentFolder] = useState("root");
  const [viewMode, setViewMode] = useState("list"); // Default to list view
  const [path, setPath] = useState<PathItem[]>([
    { id: "root", name: "My Drive" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Navigate to a folder
  const navigateToFolder = (folderId: string, folderName: string) => {
    const newPath = [...path, { id: folderId, name: folderName }];
    setPath(newPath);
    setCurrentFolder(folderId);
  };

  // Navigate back
  const navigateBack = () => {
    if (path.length > 1) {
      const newPath = [...path.slice(0, -1)];
      setPath(newPath);
      // Add null check before accessing the id
      if (newPath.length > 0) {
        setCurrentFolder(newPath[newPath.length - 1]?.id ?? "root");
      } else {
        setCurrentFolder("root"); // Fallback to root if path is empty
      }
    }
  };

  // Navigate to specific path index
  const navigateToPathIndex = (index: number) => {
    if (index >= 0 && index < path.length) {
      const newPath = [...path.slice(0, index + 1)];
      setPath(newPath);
      // Add null check before accessing the id
      if (newPath.length > 0) {
        setCurrentFolder(newPath[newPath.length - 1]?.id ?? "root");
      } else {
        setCurrentFolder("root"); // Fallback to root if path is empty
      }
    }
  };

  // Handle upload button click
  const handleUpload = () => {
    setShowUploadModal(true);
  };

  // Close upload modal
  const closeUploadModal = () => {
    setShowUploadModal(false);
  };

  // Get current folder contents
  const getCurrentFolderContents = (): FileItem[] => {
    const currentFolderData = data[
      currentFolder as keyof typeof data
    ] as FileItem;
    if (!currentFolderData || !currentFolderData.children) return [];

    return currentFolderData.children
      .map((childId) => data[childId as keyof typeof data] as FileItem)
      .filter((item) => {
        // If there's a search query, filter items by name
        if (searchQuery) {
          return item.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      })
      .sort((a, b) => {
        // Sort folders first, then files
        if (a.type === "folder" && b.type !== "folder") {
          return -1;
        }
        if (a.type !== "folder" && b.type === "folder") {
          return 1;
        }
        return a.name.localeCompare(b.name);
      });
  };

  // Render path breadcrumbs
  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center overflow-x-auto py-3 text-sm text-gray-300">
        {path.map((item, index) => (
          <React.Fragment key={item.id}>
            <span
              className="cursor-pointer whitespace-nowrap hover:text-blue-400"
              onClick={() => navigateToPathIndex(index)}
            >
              {item.name}
            </span>
            {index < path.length - 1 && (
              <ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Mock Upload Modal
  const UploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="w-96 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-bold text-white">Upload Files</h2>
          <div className="mb-4 rounded-lg border-2 border-dashed border-gray-600 p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-400">
              Drag and drop files here or
            </p>
            <button className="mt-2 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
              Browse Files
            </button>
          </div>
          <div className="flex justify-end">
            <button
              className="mr-2 rounded bg-gray-700 px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
              onClick={closeUploadModal}
            >
              Cancel
            </button>
            <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto min-h-screen rounded-lg bg-gray-900 p-6 text-gray-100 shadow">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">Drive Clone</h1>
        </div>
        <div className="relative">
          <div className="flex items-center rounded-full border border-gray-700 bg-gray-800 px-4 py-2">
            <Search className="mr-2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in Drive"
              className="bg-transparent text-gray-200 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Breadcrumbs (always visible) */}
      <div className="mb-4 border-b border-gray-700">{renderBreadcrumbs()}</div>

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          {path.length > 1 && (
            <button
              className="mr-2 rounded-full p-2 hover:bg-gray-800"
              onClick={navigateBack}
            >
              <ArrowLeft className="h-5 w-5 text-gray-300" />
            </button>
          )}
          <span className="text-lg font-medium text-white">
            {path.length > 0 ? path[path.length - 1]?.name : "My Drive"}
          </span>
        </div>
        <div className="flex items-center">
          <button
            className={`rounded-full p-2 ${
              viewMode === "list" ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-5 w-5 text-gray-300" />
          </button>
          <button
            className={`ml-2 rounded-full p-2 ${
              viewMode === "grid" ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-5 w-5 text-gray-300" />
          </button>
          <button
            className="ml-4 flex items-center rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handleUpload}
          >
            <Upload className="mr-2 h-4 w-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {getCurrentFolderContents().map((item) => (
            <div
              key={item.id}
              className="flex cursor-pointer flex-col items-center rounded-lg border border-gray-800 p-3 hover:bg-gray-800"
              onClick={() =>
                item.type === "folder"
                  ? navigateToFolder(item.id, item.name)
                  : window.open(item.url, "_blank")
              }
            >
              {item.type === "folder" ? (
                <Folder className="h-16 w-16 text-yellow-500" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center text-4xl">
                  {getFileIcon(item.fileType || "")}
                </div>
              )}
              <span className="mt-2 w-full truncate text-center text-sm text-gray-300">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Modified
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {getCurrentFolderContents().map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer hover:bg-gray-700"
                  onClick={() =>
                    item.type === "folder"
                      ? navigateToFolder(item.id, item.name)
                      : window.open(item.url, "_blank")
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.type === "folder" ? (
                        <Folder className="mr-3 h-5 w-5 text-yellow-500" />
                      ) : (
                        <span className="mr-3 text-xl">
                          {getFileIcon(item.fileType || "")}
                        </span>
                      )}
                      <span className="text-sm text-gray-200">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">
                      {item.type === "folder"
                        ? "Folder"
                        : item.fileType?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-400">
                    {item.type === "folder" ? "-" : item.size}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-400">
                    {item.modified || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal />
    </div>
  );
}
