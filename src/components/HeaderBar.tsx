import { FileText } from "lucide-react";

interface HeaderBarProps {
  

}

export default function  HeaderBar({
 
 
}: HeaderBarProps) {
  return (
    <>
    <header className="h-14 bg-background border-b  grid grid-cols-3 items-center px-4">
      {/* Left: Logo & Navigation */}
      <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">VAPDFKIT</span>
          </div>
      <div className="flex items-center gap-2">

        {/* User Menu */}
        {/* DROPDOWN */}

        <div className="flex gap-1">
          {/* <Button
            variant={activeNavButton === 'design' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => {
              setOptimisticNav('design');
              setActiveSidebarTab('layers');
              // Restore last design URL if available
              if (lastDesignUrl) {
                router.push(lastDesignUrl);
              } else {
                const targetPageId = storeCurrentPageId || findHomepage(storePages)?.id || storePages[0]?.id;
                if (targetPageId) {
                  navigateToLayers(targetPageId);
                }
              }
            }}
          >
            <Icon name="cursor-default" />
            Design
          </Button>
          <Button
            variant={activeNavButton === 'cms' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => {
              // Save current design URL before navigating away
              const isDesignRoute = routeType === 'layers' || routeType === 'page' || routeType === 'component';
              if (isDesignRoute) {
                setLastDesignUrl(window.location.pathname + window.location.search);
              }
              setOptimisticNav('cms');
              setActiveSidebarTab('cms');
              // Navigate to last selected or first available collection
              const targetCollectionId = storeSelectedCollectionId || collections[0]?.id;
              if (targetCollectionId) {
                setSelectedCollectionId(targetCollectionId);
                navigateToCollection(targetCollectionId);
              } else {
                navigateToCollections();
              }
            }}
          >
            <Icon name="database" />
            CMS
          </Button>
          <Button
            variant={activeNavButton === 'forms' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => {
              // Save current design URL before navigating away
              const isDesignRoute = routeType === 'layers' || routeType === 'page' || routeType === 'component';
              if (isDesignRoute) {
                setLastDesignUrl(window.location.pathname + window.location.search);
              }
              setOptimisticNav('forms');
              router.push('/ycode/forms');
            }}
          >
            <Icon name="form" />
            Forms
          </Button> */}
        </div>
      </div>

      <div className="flex gap-1.5 items-center justify-center">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="xs" variant="ghost">
              <Icon name="globe" />
              {selectedLocale ? selectedLocale.code.toUpperCase() : 'EN'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={selectedLocaleId || ''}
              onValueChange={(value) => setSelectedLocaleId(value)}
            >
              {locales.map((locale) => (
                <DropdownMenuRadioItem key={locale.id} value={locale.id}>
                  <span className="flex items-center gap-3">
                    {locale.label}
                    {locale.is_default && (
                      <Badge variant="secondary" className="text-[10px] mr-5">
                        Default
                      </Badge>
                    )}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {!pathname?.startsWith('/ycode/localization') && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push('/ycode/localization')}
                >
                  Manage locales
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu> */}

        <div className="h-5">
          {/* <Separator orientation="vertical" /> */}
        </div>

        {/* <Button
          size="xs"
          variant="ghost"
          asChild
        >
          <a
            href={baseUrl + publishedUrl} target="_blank"
            rel="noopener noreferrer"
          >
            {baseUrl}
          </a>
        </Button>

        {hasUpdate && (
          <>
            <div className="h-5">
              <Separator orientation="vertical" />
            </div>

            <Button
              size="xs"
              variant="default"
              className="bg-primary/20 hover:bg-primary/30 text-blue-400 hover:text-blue-300"
              onClick={() => router.push('/ycode/settings/updates')}
            >
              Update available
            </Button>
          </>
        )} */}
      </div>

      {/* Right: User & Actions */}
      <div className="flex items-center justify-end gap-2">
        {/* Active Users */}
        {/* <ActiveUsersInHeader /> */}

        {/* Invite User */}
        {/* <InviteUserButton /> */}

        {/* Save Status Indicator */}
        <div className="flex items-center justify-end w-16 text-xs text-zinc-500 dark:text-white/50">
          {/* {isSaving ? (
            <>
              <span>Saving</span>
            </>
          ) : hasUnsavedChanges ? (
            <>
              <span>Unsaved</span>
            </>
          ) : lastSaved ? (
            <>
              <span>Saved</span>
            </>
          ) : (
            <>
              <span>Ready</span>
            </>
          )} */}
        </div>

        {/* Preview button */}
        {/* <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            if (isPreviewMode) {
              if (previewReturnUrl) {
                // Navigate back while keeping preview visible — the useEffect
                // above will turn off preview once the route change completes
                if (previewReturnTab) {
                  setActiveSidebarTab(previewReturnTab);
                }
                router.push(previewReturnUrl);
                setPreviewReturn(null);
                return;
              }

              setPreviewMode(false);
              updateQueryParams({ preview: undefined });
              return;
            }

            setPreviewMode(true);

            // Preview renders the current page, so when invoked from a non-design
            // route (CMS, forms, etc.) we need to jump to the layers view first
            const isDesignRoute = routeType === 'layers' || routeType === 'page' || routeType === 'component' || routeType === null;
            if (!isDesignRoute && currentPageId) {
              setPreviewReturn(window.location.pathname + window.location.search, activeTab);
              setActiveSidebarTab('layers');
              const params = new URLSearchParams(window.location.search);
              params.set('preview', 'true');
              router.push(`/ycode/layers/${currentPageId}?${params.toString()}`);
              return;
            }

            updateQueryParams({ preview: 'true' });
          }}
          disabled={!currentPage || isSaving}
          className={isPreviewMode ? 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90' : ''}
        >
          <Icon name="preview" />
        </Button> */}

        {/* <PublishPopover
          isPublishing={isPublishing}
          setIsPublishing={setIsPublishing}
          baseUrl={baseUrl}
          publishedUrl={publishedUrl}
          onPublishSuccess={onPublishSuccess}
        /> */}

      </div>
    </header>

    {/* <BackupRestoreDialog
      open={showTransferDialog}
      onOpenChange={setShowTransferDialog}
    /> */}
    </>
  );
}
