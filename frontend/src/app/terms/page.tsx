import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Terms & Services',
    description: "Terms and Services of TIME CYBERMEDIA News — India's trusted news portal. Read our usage terms and conditions.",
    robots: { index: false, follow: false },
};

const TermsAndServices = () => {
    return (
        <div className="min-h-screen pt-28 md:pt-36 lg:pt-44 pb-24 px-4 sm:px-8 bg-[var(--background)] text-[var(--text-color)] font-['Inter',sans-serif] transition-[background-color,color] duration-400 bg-[radial-gradient(circle_at_0%_0%,rgba(var(--primary-rgb,59,130,246),0.03)_0%,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(var(--accent-rgb,147,51,234),0.03)_0%,transparent_50%)]">
            <div className="max-w-[960px] mx-auto bg-[var(--card-bg,rgba(255,255,255,0.02))] backdrop-blur-[20px] border border-[var(--border)] rounded-[24px] md:rounded-[32px] p-6 py-12 sm:p-12 md:p-16 lg:p-24 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[6px] before:bg-gradient-to-r before:from-[var(--primary)] before:to-[var(--accent)] before:opacity-80">
                <header className="mb-12 md:mb-20 text-center relative after:content-[''] after:block after:w-20 after:h-1 after:bg-[var(--primary)] after:mx-auto after:mt-10 after:rounded-[2px] after:opacity-60">
                    <h1 className="font-['Lora',serif] text-[2.2rem] sm:text-[3rem] lg:text-[3.5rem] font-bold text-[var(--heading-color)] mb-0 tracking-tighter leading-[1.1]">Terms & Services</h1>
                </header>

                <div className="leading-[1.9] text-[1.1rem] text-black [&_h2]:font-['Lora',serif] [&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-18 [&_h2]:mb-7 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-[1.2rem] [&_h2]:tracking-tight [&_h2]:before:content-[''] [&_h2]:before:w-1 [&_h2]:before:h-7 [&_h2]:before:bg-gradient-to-b [&_h2]:before:from-[var(--primary)] [&_h2]:before:to-[var(--accent)] [&_h2]:before:rounded md:[&_h2]:text-[1.6rem] md:[&_h2]:mt-14 md:[&_h2]:mb-6 [&_h3]:text-[1.4rem] [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-10 [&_h3]:mb-5 [&_h3]:tracking-tight [&_p]:mb-7 [&_ul]:list-none [&_ul]:pl-2 [&_ul]:mb-10 [&_li]:relative [&_li]:pl-8 [&_li]:mb-4 [&_li]:flex [&_li]:items-start [&_li]:before:content-['→'] [&_li]:before:text-[var(--primary)] [&_li]:before:font-bold [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:transition-transform [&_li]:duration-300 hover:[&_li]:before:translate-x-1">
                    <p className="text-[1.35rem] text-black mb-16 font-medium leading-[1.6] font-['Lora',serif] italic md:text-[1.15rem]">
                        Welcome to <span className="text-[var(--primary)] font-bold">TIME CYBERMEDIA Pvt.Ltd.</span> By accessing or using our website and services, you agree to comply with and be bound by the following Terms & Services. Please read them carefully.
                    </p>

                    <h2>1. Introduction</h2>
                    <p>TIME CYBERMEDIA Pvt.Ltd. (“Company,” “we,” “our,” or “us”) provides services including but not limited to:</p>
                    <ul>
                        <li>Award nominations and event management</li>
                        <li>Summits, conferences & exhibitions</li>
                        <li>Research & media services</li>
                        <li>Branding, digital marketing & promotion</li>
                        <li>Consultancy and business networking services</li>
                    </ul>
                    <p>By using our website, submitting forms, or participating in our events, you agree to these Terms.</p>

                    <h2>2. Eligibility</h2>
                    <p>By using our services, you confirm that:</p>
                    <ul>
                        <li>You are at least 18 years of age.</li>
                        <li>All information provided by you is accurate and complete.</li>
                        <li>You have authority to submit nominations or applications on behalf of your organization (if applicable).</li>
                    </ul>

                    <h2>3. Nominations & Awards</h2>
                    <ul>
                        <li>Submission of nomination does not guarantee selection of award.</li>
                        <li>All nominations are subject to review by the internal jury panel.</li>
                        <li>The Company reserves the right to accept, reject, or cancel any nomination without prior notice.</li>
                        <li>Nomination or participation fees (if applicable) are non-refundable unless otherwise stated in writing.</li>
                        <li>Award titles and categories may be modified at the Company’s discretion.</li>
                    </ul>

                    <h2>4. Payments & Fees</h2>
                    <ul>
                        <li>All fees must be paid in full before the event date unless agreed otherwise in writing.</li>
                        <li>Payment once made is non-refundable and non-transferable.</li>
                        <li>The Company is not responsible for any bank or transaction charges.</li>
                    </ul>

                    <h2>5. Event Participation</h2>
                    <ul>
                        <li>The Company reserves the right to change event date, venue, speaker lineup, or program schedule.</li>
                        <li>In case of unforeseen circumstances (natural disaster, government restrictions, force majeure), the event may be rescheduled.</li>
                        <li>The Company shall not be liable for travel, accommodation, or other personal expenses incurred by participants.</li>
                    </ul>

                    <h2>6. Use of Content & Media</h2>
                    <p>By participating in our events or submitting nominations, you agree that:</p>
                    <ul>
                        <li>The Company may use your name, logo, photographs, and videos for promotional purposes.</li>
                        <li>Event photographs and recordings may be published on our website, social media, and marketing materials.</li>
                        <li>You grant us a non-exclusive, royalty-free right to use such materials.</li>
                    </ul>

                    <h2>7. Intellectual Property</h2>
                    <p>All content on this website including text, logos, graphics, event names, and designs are the intellectual property of TIME CYBERMEDIA Pvt.Ltd. and may not be copied, reproduced, or distributed without prior written permission.</p>

                    <h2>8. User Conduct</h2>
                    <p>Users agree not to:</p>
                    <ul>
                        <li>Provide false or misleading information.</li>
                        <li>Misuse the website or attempt unauthorized access.</li>
                        <li>Post defamatory, offensive, or unlawful content.</li>
                    </ul>

                    <h2>9. Limitation of Liability</h2>
                    <p>TIME CYBERMEDIA Pvt.Ltd. shall not be liable for:</p>
                    <ul>
                        <li>Any indirect or consequential loss.</li>
                        <li>Technical errors, website downtime, or service interruptions.</li>
                        <li>Decisions made based on information provided on the website.</li>
                    </ul>

                    <h2>10. Privacy</h2>
                    <p>Your personal information will be handled in accordance with our Privacy Policy. By using our website, you consent to the collection and use of information as described.</p>

                    <h2>11. Cancellation & Refund Policy</h2>
                    <ul>
                        <li>Registration or nomination fees are non-refundable.</li>
                        <li>If the Company cancels an event, participants may receive credit for future events at the Company’s discretion.</li>
                    </ul>

                    <h2>12. Governing Law</h2>
                    <p>These Terms & Services shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of courts located in Delhi, India.</p>

                    <h2>13. Changes to Terms</h2>
                    <p>TIME CYBERMEDIA Pvt.Ltd. reserves the right to modify these Terms at any time. Updated versions will be posted on the website.</p>

                    <div className="mt-24 p-14 bg-[rgba(var(--primary-rgb,59,130,246),0.03)] rounded-[24px] border border-[var(--border)] shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] [&_h2]:before:hidden [&_h2]:mt-0 [&_h2]:mb-8">
                        <h2>14. Contact Information</h2>
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

export default TermsAndServices;
