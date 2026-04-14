import { usePdfEditor } from './usePdfEditor'
import DropZone from '@/components/DropZone'
import { Toolbar } from './Toolbar'
import { Alert } from '@heroui/react'
import IconFile from '~icons/tabler/file-type-pdf'
import { FileList } from './FileList'
import { PageGrid } from './PageGrid'
import { UnlockModal, PendingFileModal } from './PasswordModal'
import { PreviewModal } from './PreviewModal'

export default function PdfEditorApp() {
  const {
    files,
    pages,
    selectedPages,
    error,
    isProcessing,
    draggedPage,
    previewUrl,
    unlockPassword,
    lockedFileId,
    pendingFile,
    modalError,
    inputRef,
    setUnlockPassword,
    setLockedFileId,
    handleFiles,
    handleInputChange,
    rotatePage,
    deletePage,
    deleteSelectedPages,
    togglePageSelection,
    selectAllPages,
    handlePageDragStart,
    handlePageDragOver,
    handlePageDragEnd,
    exportPdf,
    exportSelectedPages,
    exportPagesAsImages,
    unlockPdf,
    previewPdf,
    closePreview,
    clearAll,
    getFileName,
    bypassRestrictions,
    bypassPendingFile,
    handlePasswordSubmit,
    closePendingModal,
    closeUnlockModal,
  } = usePdfEditor()

  // Empty state (but still show password modal if pending)
  if (files.length === 0 && !pendingFile) {
    return (
      <DropZone
        icon={<IconFile className="w-10 h-10" />}
        title="Drop PDFs or click to upload"
        dragTitle="Drop PDFs here"
        subtitle="Select multiple files to merge • Reorder pages by dragging"
        accept="application/pdf"
        multiple
        onFiles={handleFiles}
        error={error}
      />
    )
  }

  return (
    <div className="flex flex-col h-full bg-surface-secondary">
      <Toolbar
        pagesCount={pages.length}
        selectedCount={selectedPages.size}
        isProcessing={isProcessing}
        inputRef={inputRef}
        onInputChange={handleInputChange}
        onSelectAll={selectAllPages}
        onDeleteSelected={deleteSelectedPages}
        onExtractSelected={exportSelectedPages}
        onExportImages={() => exportPagesAsImages()}
        onExportSelectedImages={selectedPages.size > 0 ? () => exportPagesAsImages(selectedPages) : undefined}
        onClearAll={clearAll}
        onExport={exportPdf}
      />

      {/* Error banner */}
      {error && (
        <div className="shrink-0 px-4 pt-2">
          <Alert status="danger">{error}</Alert>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4">
        <FileList
          files={files}
          onUnlock={setLockedFileId}
          onBypass={bypassRestrictions}
          onPreview={previewPdf}
        />

        <PageGrid
          pages={pages}
          selectedPages={selectedPages}
          draggedPage={draggedPage}
          filesCount={files.length}
          getFileName={getFileName}
          onToggleSelection={togglePageSelection}
          onRotate={rotatePage}
          onDelete={deletePage}
          onDragStart={handlePageDragStart}
          onDragOver={handlePageDragOver}
          onDragEnd={handlePageDragEnd}
        />
      </div>

      {/* Modals */}
      <UnlockModal
        isOpen={!!lockedFileId}
        isProcessing={isProcessing}
        password={unlockPassword}
        onPasswordChange={setUnlockPassword}
        onUnlock={() => lockedFileId && unlockPdf(lockedFileId, unlockPassword)}
        onClose={closeUnlockModal}
      />

      <PendingFileModal
        isOpen={!!pendingFile}
        isProcessing={isProcessing}
        password={unlockPassword}
        error={modalError}
        onPasswordChange={setUnlockPassword}
        onSubmit={handlePasswordSubmit}
        onBypass={bypassPendingFile}
        onClose={closePendingModal}
      />

      <PreviewModal
        url={previewUrl}
        onClose={closePreview}
      />
    </div>
  )
}
