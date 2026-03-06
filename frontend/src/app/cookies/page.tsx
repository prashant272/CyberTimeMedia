import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Cookie Policy',
    description: "Cookie Policy of TIME CYBERMEDIA News — India's trusted news portal. Learn how we use cookies.",
    robots: { index: false, follow: false },
};

const CookiePolicy = () => {
    return (
        <div className="min-h-screen pt-40 pb-24 px-8 bg-[var(--background)] text-[var(--text-color)] font-['Inter',sans-serif] transition-[background-color,color] duration-400 bg-[radial-gradient(circle_at_0%_0%,rgba(var(--primary-rgb,59,130,246),0.03)_0%,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(var(--accent-rgb,147,51,234),0.03)_0%,transparent_50%)] md:pt-32 md:pb-16 md:px-4">
            <div className="max-w-[960px] mx-auto bg-[var(--card-bg,rgba(255,255,255,0.02))] backdrop-blur-[20px] border border-[var(--border)] rounded-[32px] p-20 py-20 px-24 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[6px] before:bg-gradient-to-r before:from-[var(--primary)] before:to-[var(--accent)] before:opacity-80 lg:px-12 lg:py-16 md:p-12 md:px-7 md:rounded-[20px]">
                <header className="mb-20 text-center relative after:content-[''] after:block after:w-20 after:h-1 after:bg-[var(--primary)] after:mx-auto after:mt-10 after:rounded-[2px] after:opacity-60">
                    <h1 className="font-['Lora',serif] text-[3.5rem] font-bold text-[var(--heading-color)] mb-0 tracking-tighter leading-[1.1] md:text-[2.5rem]">Cookie Policy</h1>
                </header>

                <div className="leading-[1.9] text-[1.1rem] text-black [&_h2]:font-['Lora',serif] [&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-18 [&_h2]:mb-7 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-[1.2rem] [&_h2]:tracking-tight [&_h2]:before:content-[''] [&_h2]:before:w-1 [&_h2]:before:h-7 [&_h2]:before:bg-gradient-to-b [&_h2]:before:from-[var(--primary)] [&_h2]:before:to-[var(--accent)] [&_h2]:before:rounded md:[&_h2]:text-[1.6rem] md:[&_h2]:mt-14 md:[&_h2]:mb-6 [&_h3]:text-[1.4rem] [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-10 [&_h3]:mb-5 [&_h3]:tracking-tight [&_p]:mb-7 [&_ul]:list-none [&_ul]:pl-2 [&_ul]:mb-10 [&_li]:relative [&_li]:pl-8 [&_li]:mb-4 [&_li]:flex [&_li]:items-start [&_li]:before:content-['→'] [&_li]:before:text-[var(--primary)] [&_li]:before:font-bold [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:transition-transform [&_li]:duration-300 hover:[&_li]:before:translate-x-1">
                    <p className="text-[1.35rem] text-black mb-16 font-medium leading-[1.6] font-['Lora',serif] italic md:text-[1.15rem]">
                        <span className="text-[var(--primary)] font-bold">TIME CYBERMEDIA Pvt.Ltd.</span> (“TIME CYBERMEDIA,” “we,” “our,” or “us”) uses cookies and similar technologies on our website to enhance user experience, analyze website performance, and provide relevant information about our services, events, awards, and media initiatives.
                    </p>

                    <p>This Cookies Policy explains what cookies are, how we use them, and your choices regarding their use.</p>

                    <h2>1. What Are Cookies?</h2>
                    <p>Cookies are small text files that are stored on your computer, smartphone, or other device when you visit a website. They help websites function properly, improve efficiency, and provide analytical information to website owners.</p>
                    <p>Cookies may be:</p>
                    <ul>
                        <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser.</li>
                        <li><strong>Persistent Cookies:</strong> Stored on your device for a set period or until manually deleted.</li>
                    </ul>

                    <h2>2. How We Use Cookies</h2>
                    <p>We use cookies for the following purposes:</p>

                    <h3>a) Essential Cookies</h3>
                    <p>These cookies are necessary for the website to function properly. They enable core features such as:</p>
                    <ul>
                        <li>Page navigation</li>
                        <li>Secure form submission</li>
                        <li>Access to secure areas of the website</li>
                    </ul>

                    <h3>b) Performance & Analytics Cookies</h3>
                    <p>These cookies help us understand how visitors interact with our website by collecting anonymous information such as:</p>
                    <ul>
                        <li>Number of visitors</li>
                        <li>Pages visited</li>
                        <li>Time spent on the website</li>
                        <li>Traffic sources</li>
                    </ul>

                    <h3>c) Functional Cookies</h3>
                    <p>These cookies allow the website to remember choices you make, such as:</p>
                    <ul>
                        <li>Language preferences</li>
                        <li>Region selection</li>
                        <li>Form autofill data</li>
                    </ul>

                    <h3>d) Marketing & Advertising Cookies</h3>
                    <p>These cookies may be used to:</p>
                    <ul>
                        <li>Deliver relevant promotional content</li>
                        <li>Measure the effectiveness of marketing campaigns</li>
                        <li>Show advertisements based on your interests</li>
                    </ul>

                    <h2>3. Third-Party Cookies</h2>
                    <p>We may use trusted third-party services such as:</p>
                    <ul>
                        <li>Google Analytics</li>
                        <li>Social media plugins (Facebook, Instagram, LinkedIn, etc.)</li>
                        <li>Email marketing tools</li>
                    </ul>
                    <p>These third parties may set cookies on your device in accordance with their own privacy policies.</p>

                    <h2>4. Managing Cookies</h2>
                    <p>You have the right to control and manage cookies. You can:</p>
                    <ul>
                        <li>Modify your browser settings to block or delete cookies.</li>
                        <li>Set your browser to notify you when cookies are being used.</li>
                        <li>Disable specific categories of cookies through our cookie consent banner.</li>
                    </ul>
                    <p>Please note that disabling certain cookies may affect website functionality.</p>

                    <h2>5. Data Protection</h2>
                    <p>Any personal information collected through cookies will be processed in accordance with our Privacy Policy and applicable data protection laws.</p>

                    <h2>6. Updates to This Policy</h2>
                    <p>TIME CYBERMEDIA Pvt.Ltd. reserves the right to update this Cookies Policy at any time. Changes will be posted on this page with an updated effective date.</p>

                    <div className="mt-24 p-14 bg-[rgba(var(--primary-rgb,59,130,246),0.03)] rounded-[24px] border border-[var(--border)] shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] [&_h2]:before:hidden [&_h2]:mt-0 [&_h2]:mb-8">
                        <h2>7. Contact Us</h2>
                        <p>If you have any questions about this Cookies Policy, please contact us:</p>
                        <div className="grid gap-[1.2rem]">
                            <span className="block mb-0 text-[1.1rem]"><strong className="text-[var(--heading-color)] w-[140px] inline-block sm:block sm:w-auto sm:mb-1">TIME CYBERMEDIA Pvt.Ltd.</strong></span>
                            <div className="flex flex-col gap-2">
                                <span className="block text-[1.1rem]"><strong className="text-[var(--heading-color)] w-[140px] inline-block sm:block sm:w-auto">Delhi Office:</strong> C-31, 3rd Floor, Nawada Housing Complex, Opp. Metro Pillar No 792, Shivaji Marg, New Delhi 110059</span>
                                <span className="block text-[1.1rem]"><strong className="text-[var(--heading-color)] w-[140px] inline-block sm:block sm:w-auto">Mumbai Office:</strong> A/201 202, Vinayak Shopping Centre, Pravati Cross, Vasai Station Rd, opp. Union Bank, Vasai West, Mumbai Maharashtra 401202</span>
                            </div>
                            <span className="block mb-0 text-[1.1rem]"><strong className="text-[var(--heading-color)] w-[140px] inline-block sm:block sm:w-auto sm:mb-1">Email:</strong> info@timecybermedia.com</span>
                            <span className="block mb-0 text-[1.1rem]"><strong className="text-[var(--heading-color)] w-[140px] inline-block sm:block sm:w-auto sm:mb-1">Phone:</strong> +91-9821020995, +91-9873094416</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
