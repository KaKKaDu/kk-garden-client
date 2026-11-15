import type { ReactNode } from 'react';
import { BrandMark } from '@/components/BrandMark';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailOtpSignInForm } from '../EmailOtpSignInForm/EmailOtpSignInForm';
import { PasskeySignInButton } from '../PasskeySignInButton/PasskeySignInButton';
import { SocialSignInButtons } from '../SocialSignInButtons/SocialSignInButtons';
import { signInViewClassNames as classNames } from './sign-in-view.styles';
import { signInViewTexts as texts } from './texts';

export const SignInView = (): ReactNode => (
  <main className={classNames.main}>
    <div className={classNames.card}>
      <aside className={classNames.aside}>
        <div className={classNames.topDecoration} />
        <div className={classNames.bottomDecoration} />
        <div className={classNames.brandRow}>
          <BrandMark size="large" />
          <span className={classNames.brandName}>{texts.brand}</span>
        </div>
        <div className={classNames.brandCopy}>
          <p className={classNames.eyebrow}>{texts.eyebrow}</p>
          <h2 className={classNames.headline}>{texts.headline}</h2>
          <p className={classNames.description}>{texts.description}</p>
        </div>
        <p className={classNames.tagline}>{texts.tagline}</p>
      </aside>

      <section className={classNames.content}>
        <div className={classNames.contentColumn}>
          <div className={classNames.mobileBrand}>
            <BrandMark size="medium" />
            <span>{texts.brand}</span>
          </div>

          <Tabs className={classNames.tabs} defaultValue="login">
            <TabsList aria-label={texts.modeTabsLabel} className={classNames.tabList}>
              <TabsTrigger value="login">{texts.loginTab}</TabsTrigger>
              <TabsTrigger value="register">{texts.registerTab}</TabsTrigger>
            </TabsList>

            <TabsContent className={classNames.tabContent} value="login">
              <div className={classNames.titleCopy}>
                <h1 className={classNames.pageTitle}>{texts.title}</h1>
                <p className={classNames.instructions}>{texts.instructions}</p>
              </div>

              <div className={classNames.loginContent}>
                <EmailOtpSignInForm />

                <div className={classNames.separator}>
                  <span className={classNames.separatorRule} />
                  <span className={classNames.separatorText}>{texts.separator}</span>
                  <span className={classNames.separatorRule} />
                </div>

                <div className={classNames.socialButtons}>
                  <PasskeySignInButton />
                  <SocialSignInButtons />
                </div>
              </div>
            </TabsContent>

            <TabsContent className={classNames.tabContent} value="register">
              <div className={classNames.titleCopy}>
                <h1 className={classNames.pageTitle}>{texts.registerTitle}</h1>
                <p className={classNames.instructions}>{texts.registerInstructions}</p>
              </div>

              <SocialSignInButtons />
            </TabsContent>
          </Tabs>

          <p className={classNames.disclaimer}>{texts.disclaimer}</p>
        </div>
      </section>
    </div>
  </main>
);
