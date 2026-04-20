'use client';

import { yieldzNeutral } from '@/styles/theme';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { CloudArrowUp as CloudArrowUpIcon } from '@phosphor-icons/react/dist/ssr/CloudArrowUp';
import { File as FileIcon } from '@phosphor-icons/react/dist/ssr/File';
import { FileImage as FileImageIcon } from '@phosphor-icons/react/dist/ssr/FileImage';
import { FilePdf as FilePdfIcon } from '@phosphor-icons/react/dist/ssr/FilePdf';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import * as React from 'react';
import type { DropzoneOptions, FileRejection, FileWithPath } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import AtomTypography from '../atoms/typography';

export type File = FileWithPath;

/**
 * File size constants for NorthCapital verification document upload
 * - Minimum: 1 KB (1024 bytes)
 * - Maximum: 50 MB (104857600 bytes)
 */
const MIN_FILE_SIZE = 1024; // 1 KB in bytes
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB in bytes

/**
 * Accepted file types for NorthCapital verification document upload
 * Supports: PDF, JPG, JPEG, PNG
 */
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

/**
 * Valid file extensions (case-insensitive)
 * Used to validate file extensions explicitly to prevent files like .jfif
 * that might have image/jpeg MIME type but should not be accepted
 */
const VALID_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

/**
 * Check if file has a valid extension
 * Prevents files with valid MIME types but invalid extensions (e.g., .jfif)
 * 
 * @param file - File object to validate
 * @returns true if extension is valid, false otherwise
 */
const hasValidExtension = (file: FileWithPath): boolean => {
  const fileName = file.name || file.path || '';
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return VALID_EXTENSIONS.includes(extension);
};

/**
 * Props interface for FileDropzone component
 * 
 * @property caption - Optional descriptive text shown below upload instructions
 * @property files - Array of currently selected files
 * @property onRemove - Callback when a file is removed from the list
 * @property onRemoveAll - Callback to remove all files
 * @property onUpload - Callback when upload button is clicked
 * @property onFilesChange - Callback when files are added/changed (used for controlled state)
 * @property error - Error message to display
 * @property showFileList - Whether to show the list of selected files (default: true)
 */
export interface FileDropzoneProps extends Omit<DropzoneOptions, 'accept' | 'minSize' | 'maxSize'> {
  caption?: string;
  files?: File[];
  onRemove?: (file: File) => void;
  onRemoveAll?: () => void;
  onUpload?: () => void;
  onFilesChange?: (files: File[]) => void;
  error?: string;
  showFileList?: boolean;
}

/**
 * Format file size to human readable string
 * 
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "500 KB")
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get appropriate icon component based on file type
 * 
 * @param file - File object to get icon for
 * @returns React element with appropriate icon
 */
const getFileIcon = (file: File): React.ReactNode => {
  const type = file.type;
  if (type === 'application/pdf') {
    return <FilePdfIcon size={24} />;
  }
  if (type.startsWith('image/')) {
    return <FileImageIcon size={24} />;
  }
  return <FileIcon size={24} />;
};

/**
 * FileDropzone Component
 * 
 * A reusable file upload dropzone with NorthCapital verification document requirements:
 * - File size: 1 KB minimum, 50 MB maximum
 * - Accepted formats: PDF, JPG, JPEG, PNG
 * - Supports drag & drop and click to upload
 * - Shows file preview list with remove functionality
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Handles file selection and validation
 * - Open/Closed: Extensible through props
 * - Interface Segregation: Clean, focused prop interface
 */
export function FileDropzone({
  caption,
  files = [],
  onRemove,
  onRemoveAll,
  onFilesChange,
  error,
  showFileList = true,
  ...props
}: Readonly<FileDropzoneProps>): React.JSX.Element {
  const [rejectionErrors, setRejectionErrors] = React.useState<string[]>([]);

  // Check if multiple files are allowed (default: true)
  const isMultipleAllowed = props.multiple !== false;

  /**
   * Handle file drop/selection
   * Validates files and updates state
   * - For single file mode (multiple=false): replaces existing file
   * - For multiple file mode: appends to existing files
   * - Validates file extensions explicitly to prevent .jfif and other invalid extensions
   */
  const handleDrop = React.useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Clear previous rejection errors
      setRejectionErrors([]);

      // Additional validation: Check file extensions explicitly
      // This prevents files like .jfif that might have image/jpeg MIME type
      const validFiles: File[] = [];
      const extensionRejections: FileRejection[] = [];

      acceptedFiles.forEach((file) => {
        if (hasValidExtension(file)) {
          validFiles.push(file);
        } else {
          const fileName = file.name || 'Unknown file';
          const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
          extensionRejections.push({
            file,
            errors: [
              {
                code: 'file-invalid-type',
                message: `File extension ${extension} is not allowed. Only ${VALID_EXTENSIONS.join(', ')} are accepted.`,
              },
            ],
          });
        }
      });

      // Combine original rejections with extension rejections
      const allRejections = [...fileRejections, ...extensionRejections];

      // Process rejection errors for user feedback
      if (allRejections.length > 0) {
        const errors = allRejections.map((rejection) => {
          const fileName = rejection.file.name;
          const errorMessages = rejection.errors.map((err) => {
            if (err.code === 'file-too-small') {
              return `${fileName}: File must be at least 1 KB`;
            }
            if (err.code === 'file-too-large') {
              return `${fileName}: File cannot exceed 50 MB`;
            }
            if (err.code === 'file-invalid-type') {
              return `${fileName}: Only PDF, JPG, JPEG, and PNG files are allowed`;
            }
            if (err.code === 'too-many-files') {
              return 'Only one file is allowed';
            }
            return `${fileName}: ${err.message}`;
          });
          return errorMessages.join(', ');
        });
        setRejectionErrors(errors);
      }

      // Call parent callback with only valid files (with valid extensions)
      if (onFilesChange && validFiles.length > 0) {
        if (isMultipleAllowed) {
          // Multiple files mode: append new files to existing
          onFilesChange([...files, ...validFiles]);
        } else {
          // Single file mode: replace existing file with new one
          onFilesChange([validFiles[0]]);
        }
      }

      // Also call the original onDrop if provided (with filtered files)
      if (props.onDrop) {
        props.onDrop(validFiles, allRejections, {} as any);
      }
    },
    [files, onFilesChange, props, isMultipleAllowed]
  );

  /**
   * Configure dropzone with NorthCapital requirements
   * - Sets maxFiles to 1 when multiple is false (single file mode)
   * - File extension validation is handled in handleDrop callback
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...props,
    accept: ACCEPTED_FILE_TYPES,
    minSize: MIN_FILE_SIZE,
    maxSize: MAX_FILE_SIZE,
    maxFiles: isMultipleAllowed ? undefined : 1,
    onDrop: handleDrop,
  });

  /**
   * Handle individual file removal
   */
  const handleRemoveFile = (file: File) => {
    if (onRemove) {
      onRemove(file);
    }
    if (onFilesChange) {
      onFilesChange(files.filter((f) => f !== file));
    }
  };

  // Determine if there's an error to display
  const hasError = Boolean(error) || rejectionErrors.length > 0;
  const displayError = error || rejectionErrors.join('; ');

  return (
    <Stack spacing={2}>
      {/* Dropzone Area */}
      <Box
        sx={{
          alignItems: 'center',
          border: `1px solid ${hasError ? 'var(--mui-palette-error-main)' : yieldzNeutral[700]}`,
          borderRadius: 1,
          cursor: 'pointer',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          outline: 'none',
          p: 6,
          transition: 'all 0.2s ease-in-out',
          ...(isDragActive && { 
            bgcolor: 'var(--mui-palette-action-selected)', 
            opacity: 0.5,
            borderColor: 'var(--mui-palette-primary-main)',
          }),
          '&:hover': { 
            ...(!isDragActive && {
              borderColor: yieldzNeutral[800],
            }) 
          },
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              '--Avatar-size': '64px',
              '--Icon-fontSize': 'var(--icon-fontSize-lg)',
              bgcolor: yieldzNeutral[600],
              boxShadow: 'var(--mui-shadows-8)',
              color: hasError ? 'var(--mui-palette-error-main)' : 'var(--mui-palette-text-primary)',
            }}
          >
            <CloudArrowUpIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
          <Stack spacing={1}>
            <AtomTypography variant="h6">
              <AtomTypography component="span" sx={{ textDecoration: 'underline' }} variant="inherit">
                Click to upload
              </AtomTypography>{' '}
              or drag and drop
            </AtomTypography>
            {/* File type and size requirements caption */}
            <AtomTypography color="text.secondary" variant="subtitle2">
              {caption ?? `PDF, JPG, JPEG, or PNG (1 KB - 50 MB)${isMultipleAllowed ? '' : ' • Single file only'}`}
            </AtomTypography>
          </Stack>
        </Stack>
      </Box>

      {/* Error Messages */}
      {hasError && (
        <AtomTypography color="error" variant="subtitle2">
          {displayError}
        </AtomTypography>
      )}

      {/* Selected Files List */}
      {showFileList && files.length > 0 && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <AtomTypography variant="subtitle2" color="text.primary">
              {isMultipleAllowed ? `Selected Files (${files.length})` : 'Selected File'}
            </AtomTypography>
            {onRemoveAll && files.length > 1 && isMultipleAllowed && (
              <AtomTypography
                component="button"
                variant="body2"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onRemoveAll();
                  if (onFilesChange) {
                    onFilesChange([]);
                  }
                }}
                sx={{
                  color: 'error.main',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  textDecoration: 'underline',
                  '&:hover': { color: 'error.dark' },
                }}
              >
                Remove All
              </AtomTypography>
            )}
          </Stack>
          <List dense sx={{ bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: yieldzNeutral[700] }}>
            {files.map((file, index) => (
              <ListItem
                key={`${file.name}-${index}`}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="remove file"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file);
                    }}
                    size="small"
                  >
                    <XIcon size={16} />
                  </IconButton>
                }
                sx={{
                  borderBottom: index < files.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  {getFileIcon(file)}
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={formatFileSize(file.size)}
                  primaryTypographyProps={{ 
                    variant: 'body2', 
                    noWrap: true,
                    sx: { maxWidth: '200px' } 
                  }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <Chip
                  label={file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                  size="small"
                  sx={{ ml: 1, mr: 2 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Stack>
  );
}
