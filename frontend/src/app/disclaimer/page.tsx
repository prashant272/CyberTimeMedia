import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Disclaimer',
    description: "Disclaimer of TIME CYBERMEDIA News — India's trusted news portal.",
    robots: { index: false, follow: false },
};

const Disclaimer = () => {
    return (
        <div className="min-h-screen pt-40 pb-24 px-8 bg-[var(--background)] text-[var(--text-color)] font-['Inter',sans-serif] transition-[background-color,color] duration-400 bg-[radial-gradient(circle_at_0%_0%,rgba(var(--primary-rgb,59,130,246),0.03)_0%,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(var(--accent-rgb,147,51,234),0.03)_0%,transparent_50%)] md:pt-32 md:pb-16 md:px-4">
            <div className="max-w-[960px] mx-auto bg-[var(--card-bg,rgba(255,255,255,0.02))] backdrop-blur-[20px] border border-[var(--border)] rounded-[32px] p-20 py-20 px-24 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[6px] before:bg-gradient-to-r before:from-[var(--primary)] before:to-[var(--accent)] before:opacity-80 lg:px-12 lg:py-16 md:p-12 md:px-7 md:rounded-[20px]">
                <header className="mb-20 text-center relative after:content-[''] after:block after:w-20 after:h-1 after:bg-[var(--primary)] after:mx-auto after:mt-10 after:rounded-[2px] after:opacity-60">
                    <h1 className="font-['Lora',serif] text-[3.5rem] font-bold text-[var(--heading-color)] mb-0 tracking-tighter leading-[1.1] md:text-[2.5rem]">Disclaimer</h1>
                </header>

                <div className="leading-[1.9] text-[1.1rem] text-black [&_h2]:font-['Lora',serif] [&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-18 [&_h2]:mb-7 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-[1.2rem] [&_h2]:tracking-tight [&_h2]:before:content-[''] [&_h2]:before:w-1 [&_h2]:before:h-7 [&_h2]:before:bg-gradient-to-b [&_h2]:before:from-[var(--primary)] [&_h2]:before:to-[var(--accent)] [&_h2]:before:rounded md:[&_h2]:text-[1.6rem] md:[&_h2]:mt-14 md:[&_h2]:mb-6 [&_h3]:text-[1.4rem] [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-10 [&_h3]:mb-5 [&_h3]:tracking-tight [&_p]:mb-7 [&_ul]:list-none [&_ul]:pl-2 [&_ul]:mb-10 [&_li]:relative [&_li]:pl-8 [&_li]:mb-4 [&_li]:flex [&_li]:items-start [&_li]:before:content-['→'] [&_li]:before:text-[var(--primary)] [&_li]:before:font-bold [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:transition-transform [&_li]:duration-300 hover:[&_li]:before:translate-x-1">
                    <p className="text-[1.35rem] text-black mb-16 font-medium leading-[1.6] font-['Lora',serif] italic md:text-[1.15rem]">
                        The information provided on the website of <span className="text-[var(--primary)] font-bold">TIME CYBERMEDIA Pvt.Ltd.</span> (“Company”, “we”, “our”, or “us”) is for general informational and promotional purposes only. By accessing and using this website, you accept and agree to the terms outlined in this disclaimer.
                    </p>

                    <h2>1. General Information</h2>
                    <p>All content on this website, including text, graphics, images, event details, award information, research materials, and other content, is published in good faith and for general information purposes only. While we strive to keep the information accurate and up to date, TIME CYBERMEDIA Research Media Pvt. Ltd. makes no warranties or representations of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of any information on the website.</p>

                    <h2>2. No Professional Advice</h2>
                    <p>The information shared on this website does not constitute legal, financial, medical, business, or professional advice. Visitors are advised to conduct their own research or consult appropriate professionals before making any decisions based on the information available on this website.</p>

                    <h2>3. Awards & Recognition</h2>
                    <p>All awards, recognitions, nominations, rankings, and certifications organized or promoted by TIME CYBERMEDIA Research Media Pvt. Ltd. are subject to internal evaluation processes, eligibility criteria, documentation review, and jury decisions. The company reserves the right to accept, reject, or withdraw any nomination at its sole discretion without prior notice. Participation in any event or award program does not guarantee recognition or business outcomes.</p>

                    <h2>4. External Links</h2>
                    <p>Our website may contain links to third-party websites or external platforms for additional information or convenience. We do not control or take responsibility for the content, policies, or practices of any third-party websites.</p>

                    <h2>5. Limitation of Liability</h2>
                    <p>Under no circumstances shall TIME CYBERMEDIA Research Media Pvt. Ltd., its directors, employees, partners, or affiliates be liable for any direct, indirect, incidental, consequential, or special loss or damage arising from the use of this website or reliance on any information provided herein.</p>

                    <h2>6. Intellectual Property</h2>
                    <p>All content, logos, trademarks, images, and materials displayed on this website are the property of TIME CYBERMEDIA Research Media Pvt. Ltd. unless otherwise stated. Unauthorized use, reproduction, or distribution is strictly prohibited.</p>

                    <h2>7. Changes to Disclaimer</h2>
                    <p>We reserve the right to modify, update, or change this disclaimer at any time without prior notice. Users are encouraged to review this page periodically.</p>

                    <div className="mt-24 p-14 bg-[rgba(var(--primary-rgb,59,130,246),0.03)] rounded-[24px] border border-[var(--border)] shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] [&_h2]:before:hidden [&_h2]:mt-0 [&_h2]:mb-8">
                        <p>For any clarifications regarding this disclaimer, please contact us at <strong>info@timecybermedia.com</strong>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
