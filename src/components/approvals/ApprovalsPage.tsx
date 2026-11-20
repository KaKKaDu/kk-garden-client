'use client';

import type { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SharingListsTab } from './sharing-lists/SharingListsTab';
import { SearchSection } from './search-section/SearchSection';
import { approvalsPageClassNames as classNames } from './approvals-page.styles';
import { approvalsPageTexts as texts } from './texts';

const tabValues = {
  search: 'search',
  sharedWithMe: 'shared-with-me',
  sharedByMe: 'shared-by-me',
} as const;

export const ApprovalsPage = (): ReactNode => (
  <main className={classNames.root}>
    <Tabs className={classNames.tabs} defaultValue={tabValues.search}>
      <TabsList aria-label={texts.tabsLabel} className={classNames.tabsList}>
        <TabsTrigger className={classNames.tabsTrigger} value={tabValues.search}>
          {texts.searchTab}
        </TabsTrigger>
        <TabsTrigger className={classNames.tabsTrigger} value={tabValues.sharedWithMe}>
          {texts.sharedWithMeTab}
        </TabsTrigger>
        <TabsTrigger className={classNames.tabsTrigger} value={tabValues.sharedByMe}>
          {texts.sharedByMeTab}
        </TabsTrigger>
      </TabsList>
      <TabsContent className={classNames.tabsContent} value={tabValues.search}>
        <SearchSection />
      </TabsContent>
      <TabsContent className={classNames.tabsContent} value={tabValues.sharedWithMe}>
        <SharingListsTab scope="accessible-gardens" />
      </TabsContent>
      <TabsContent className={classNames.tabsContent} value={tabValues.sharedByMe}>
        <SharingListsTab scope="my-viewers" />
      </TabsContent>
    </Tabs>
  </main>
);
