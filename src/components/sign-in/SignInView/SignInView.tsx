import type { ReactNode } from 'react';
import { BrandMark } from '@/components/BrandMark';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailOtpSignInForm } from '../EmailOtpSignInForm/EmailOtpSignInForm';
import { PasskeySignInButton } from '../PasskeySignInButton/PasskeySignInButton';
import { SocialSignInButtons } from '../SocialSignInButtons/SocialSignInButtons';
import { signInViewTexts as texts } from './texts';

export const SignInView = (): ReactNode => (
  <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4 sm:p-8">
    <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border-2 bg-card shadow-[8px_8px_0_var(--component-shadow-color)] lg:min-h-[42rem] lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div className="absolute -right-24 -top-20 size-80 rounded-full border border-primary-foreground/10" />
        <div className="absolute -bottom-40 -left-20 size-96 rounded-full border border-primary-foreground/10" />
        <div className="relative flex items-center gap-4">
          <BrandMark size="large" />
          <span className="text-xl font-semibold tracking-tight">{texts.brand}</span>
        </div>
        <div className="relative max-w-sm space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
            {texts.eyebrow}
          </p>
          <h2 className="text-5xl font-semibold leading-tight tracking-tight">{texts.headline}</h2>
          <p className="text-base leading-7 text-primary-foreground/75">{texts.description}</p>
        </div>
        <p className="relative text-sm text-primary-foreground/60">{texts.tagline}</p>
      </aside>

      <section className="flex flex-col px-6 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="mb-7 flex items-center gap-2 text-sm font-semibold tracking-tight lg:hidden">
            <BrandMark size="medium" />
            <span>{texts.brand}</span>
          </div>

          <Tabs className="flex-1 gap-7" defaultValue="login">
            <TabsList aria-label={texts.modeTabsLabel} className="grid w-full grid-cols-2 gap-2">
              <TabsTrigger value="login">{texts.loginTab}</TabsTrigger>
              <TabsTrigger value="register">{texts.registerTab}</TabsTrigger>
            </TabsList>

            <TabsContent className="flex flex-1 flex-col justify-center space-y-7" value="login">
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight">{texts.title}</h1>
                <p className="text-sm leading-6 text-muted-foreground">{texts.instructions}</p>
              </div>

              <div className="space-y-6">
                <EmailOtpSignInForm />

                <div className="relative flex items-center">
                  <span className="h-px flex-1 bg-border" />
                  <span className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {texts.separator}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-3">
                  <PasskeySignInButton />
                  <SocialSignInButtons />
                </div>
              </div>
            </TabsContent>

            <TabsContent className="flex flex-1 flex-col justify-center space-y-7" value="register">
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight">{texts.registerTitle}</h1>
                <p className="text-sm leading-6 text-muted-foreground">
                  {texts.registerInstructions}
                </p>
              </div>

              <SocialSignInButtons />
            </TabsContent>
          </Tabs>

          <p className="mt-7 text-center text-xs leading-5 text-muted-foreground">
            {texts.disclaimer}
          </p>
        </div>
      </section>
    </div>
  </main>
);
