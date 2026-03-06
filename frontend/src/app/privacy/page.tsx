import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: "Read the Privacy Policy of TIME CYBERMEDIA News — India's leading news portal. Learn how we collect, use, and protect your personal information.",
    robots: { index: false, follow: false },
};

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen pt-40 pb-24 px-8 bg-[var(--background)] text-[var(--text-color)] font-['Inter',sans-serif] transition-[background-color,color] duration-400 bg-[radial-gradient(circle_at_0%_0%,rgba(var(--primary-rgb,59,130,246),0.03)_0%,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(var(--accent-rgb,147,51,234),0.03)_0%,transparent_50%)] md:pt-32 md:pb-16 md:px-4">
            <div className="max-w-[960px] mx-auto bg-[var(--card-bg,rgba(255,255,255,0.02))] backdrop-blur-[20px] border border-[var(--border)] rounded-[32px] p-20 py-20 px-24 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[6px] before:bg-gradient-to-r before:from-[var(--primary)] before:to-[var(--accent)] before:opacity-80 lg:px-12 lg:py-16 md:p-12 md:px-7 md:rounded-[20px]">
                <header className="mb-20 text-center relative after:content-[''] after:block after:w-20 after:h-1 after:bg-[var(--primary)] after:mx-auto after:mt-10 after:rounded-[2px] after:opacity-60">
                    <h1 className="font-['Lora',serif] text-[3.5rem] font-bold text-[var(--heading-color)] mb-0 tracking-tighter leading-[1.1] md:text-[2.5rem]">Privacy Policy</h1>
                </header>

                <div className="leading-[1.9] text-[1.1rem] text-black [&_h2]:font-['Lora',serif] [&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-18 [&_h2]:mb-7 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-[1.2rem] [&_h2]:tracking-tight [&_h2]:before:content-[''] [&_h2]:before:w-1 [&_h2]:before:h-7 [&_h2]:before:bg-gradient-to-b [&_h2]:before:from-[var(--primary)] [&_h2]:before:to-[var(--accent)] [&_h2]:before:rounded md:[&_h2]:text-[1.6rem] md:[&_h2]:mt-14 md:[&_h2]:mb-6 [&_h3]:text-[1.4rem] [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-10 [&_h3]:mb-5 [&_h3]:tracking-tight [&_p]:mb-7 [&_ul]:list-none [&_ul]:pl-2 [&_ul]:mb-10 [&_li]:relative [&_li]:pl-8 [&_li]:mb-4 [&_li]:flex [&_li]:items-start [&_li]:before:content-['→'] [&_li]:before:text-[var(--primary)] [&_li]:before:font-bold [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:transition-transform [&_li]:duration-300 hover:[&_li]:before:translate-x-1">
                    <p className="text-[1.35rem] text-black mb-16 font-medium leading-[1.6] font-['Lora',serif] italic md:text-[1.15rem]">
                        <span className="text-[var(--primary)] font-bold">TIME CYBERMEDIA Pvt.Ltd.</span> (“Company”, “we”, “our”, or “us”) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, participate in our events, submit nominations, or use our services.
                    </p>

                    <p>By accessing or using our website, you agree to the terms of this Privacy Policy.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We may collect the following types of information:</p>

                    <h3>a) Personal Information</h3>
                    <ul>
                        <li>Full Name</li>
                        <li>Contact Number</li>
                        <li>Email Address</li>
                        <li>Organization/Company Name</li>
                        <li>Designation</li>
                        <li>Address</li>
                        <li>Payment Details (for event registrations or nominations)</li>
                    </ul>

                    <h3>b) Non-Personal Information</h3>
                    <ul>
                        <li>IP address</li>
                        <li>Browser type</li>
                        <li>Device information</li>
                        <li>Pages visited</li>
                        <li>Cookies and usage data</li>
                    </ul>

                    <h3>c) Event & Nomination Information</h3>
                    <p>When you submit forms for awards, summits, or events, we may collect:</p>
                    <ul>
                        <li>Professional achievements</li>
                        <li>Company profile details</li>
                        <li>Supporting documents</li>
                        <li>Photographs or videos</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the collected information for:</p>
                    <ul>
                        <li>Processing award nominations and registrations</li>
                        <li>Communication regarding events, summits, and awards</li>
                        <li>Issuing certificates, confirmations, and invoices</li>
                        <li>Marketing and promotional communication</li>
                        <li>Improving website performance and user experience</li>
                        <li>Compliance with legal obligations</li>
                    </ul>
                    <p>We may also use photographs, videos, and event highlights for promotional purposes unless you request otherwise.</p>

                    <h2>3. Sharing of Information</h2>
                    <p>We do not sell, rent, or trade your personal information.</p>
                    <p>However, we may share information with:</p>
                    <ul>
                        <li>Event partners and sponsors (where required)</li>
                        <li>Payment gateway providers</li>
                        <li>Service providers assisting in website management</li>
                        <li>Legal authorities if required by law</li>
                    </ul>
                    <p>All third-party service providers are required to protect your data.</p>

                    <h2>4. Data Security</h2>
                    <p>We implement appropriate technical and organizational measures to safeguard your personal information against unauthorized access, misuse, alteration, or disclosure.</p>
                    <p>However, no online transmission is completely secure, and we cannot guarantee absolute security.</p>

                    <h2>5. Cookies Policy</h2>
                    <p>Our website may use cookies to:</p>
                    <ul>
                        <li>Enhance user experience</li>
                        <li>Analyze website traffic</li>
                        <li>Improve website functionality</li>
                    </ul>
                    <p>You can disable cookies through your browser settings, though some features may not function properly.</p>

                    <h2>6. Third-Party Links</h2>
                    <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those external websites.</p>

                    <h2>7. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Request correction of inaccurate information</li>
                        <li>Request deletion of your data (subject to legal obligations)</li>
                        <li>Opt-out of marketing communications</li>
                    </ul>

                    <h2>8. Children’s Privacy</h2>
                    <p>Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal data from children.</p>

                    <h2>9. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>

                    <div className="mt-24 p-14 bg-[rgba(var(--primary-rgb,59,130,246),0.03)] rounded-[24px] border border-[var(--border)] shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] [&_h2]:before:hidden [&_h2]:mt-0 [&_h2]:mb-8">
                        <h2>10. Contact Us</h2>
                        <p>If you have any questions regarding this Privacy Policy, please contact:</p>
                        <div className="grid gap-[1.2rem]">
                            <span className="block mb-0 text-[1.1rem]"><strong className="text-[var(--heading-color)] w-[140px] inline-block sm:block sm:w-auto sm:mb-1">TIME CYBERMEDIA Pvt.Ltd.</strong></span>
                            <span className="block mb-0 text-[1.1rem]"><strong className="text-[var(--heading-color)] w-[140px] inline-block sm:block sm:w-auto sm:mb-1">Email:</strong> info@timecybermedia.com</span>
                            <span className="block mb-0 text-[1.1rem]"><strong className="text-[var(--heading-color)] w-[140px] inline-block sm:block sm:w-auto sm:mb-1">Phone:</strong> +91-9821020995, +91-9873094416</span>
                            <div className="flex flex-col gap-2">
                                <span className="block text-[1.1rem]"><strong className="text-[var(--heading-color)] w-[140px] inline-block sm:block sm:w-auto">Delhi Office:</strong> C-31, 3rd Floor, Nawada Housing Complex, Opp. Metro Pillar No 792, Shivaji Marg, New Delhi 110059</span>
                                <span className="block text-[1.1rem]"><strong className="text-[var(--heading-color)] w-[140px] inline-block sm:block sm:w-auto">Mumbai Office:</strong> A/201 202, Vinayak Shopping Centre, Pravati Cross, Vasai Station Rd, opp. Union Bank, Vasai West, Mumbai Maharashtra 401202</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
