"use client";

const services = [
    {
        number: "",
        title: "Architectural Design",
        description:
            "Perencanaan dan pengembangan desain arsitektur dengan pendekatan yang matang, proporsional, dan berorientasi pada kebutuhan klien.",
    },
    {
        number: "",
        title: "3D Visualization",
        description:
            "Visualisasi tiga dimensi yang membantu Anda memahami ruang, material, pencahayaan, dan karakter desain sebelum direalisasikan.",
    },
    {
        number: "",
        title: "Interior Design",
        description:
            "Eksplorasi interior yang menyatukan fungsi, kenyamanan, estetika, dan identitas dalam satu kesatuan desain.",
    },
    {
        number: "",
        title: "CAD & Technical Modeling",
        description:
            "Pemodelan dan dokumentasi teknis yang terstruktur untuk mendukung komunikasi desain dan proses pengembangan proyek.",
    },
];

const process = [
    ["", "Discovery", "Memahami kebutuhan, tujuan, karakter, dan ruang lingkup proyek Anda."],
    ["", "Concept", "Mengembangkan arah desain yang terukur dan selaras dengan visi klien."],
    ["", "Development", "Menyempurnakan detail, visualisasi, serta kebutuhan teknis yang relevan."],
    ["", "Delivery", "Menyajikan hasil pekerjaan secara terstruktur sesuai lingkup dan kesepakatan proyek."],
];

export default function BusinessProfile() {
    const whatsapp =
        "https://wa.me/6288293243900?text=" +
        encodeURIComponent(
            "Halo NextCAD Studio, saya ingin berdiskusi mengenai kebutuhan proyek dan peluang kerja sama."
        );

    return (
        <main className="overflow-hidden bg-[#0b0b0c] text-[#f0eee9]">
            {/* HERO */}
            <section className="relative flex min-h-[570px] flex-col justify-end overflow-hidden border-b border-white/10 px-6 py-16 sm:min-h-[650px] sm:px-10 sm:py-20 lg:min-h-[690px] lg:px-16">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-35"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0c] via-[#0b0b0c]/85 to-[#0b0b0c]/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-transparent to-[#0b0b0c]/30" />

                <div className="relative z-10 max-w-5xl">
                    <p className="mb-7 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#c7b4ff] sm:text-xs">
                        <span className="h-px w-10 bg-[#a78bfa]" />
                        NextCAD Studio · Company Profile
                    </p>

                    <h1 className="max-w-4xl text-5xl font-light leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-8xl">
                        Great ideas
                        <br />
                        deserve <span className="text-[#b9a783]">great design.</span>
                    </h1>

                    <p className="mt-7 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                        Kami membantu mengubah gagasan menjadi rancangan visual yang
                        terarah, berkarakter, dan mudah dipahami. Dari konsep awal hingga
                        visualisasi detail, setiap keputusan desain dibuat dengan tujuan
                        yang jelas.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-6">
                        <a
                            href="#expertise"
                            className="border-b border-white/30 pb-2 text-xs uppercase tracking-[0.15em] text-white/75 transition hover:border-white hover:text-white"
                        >
                            Explore Our Expertise
                        </a>
                    </div>
                </div>

                <div className="relative z-10 mt-16 flex items-end justify-between border-t border-white/20 pt-5">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-white/45 sm:text-[10px]">
                        Architecture · Visualization · Digital Design
                    </span>
                    <span className="text-xs tracking-[0.2em] text-white/50">
                        01 / 04
                    </span>
                </div>
            </section>

            {/* COMPANY STATEMENT */}
            <section className="grid gap-10 border-b border-white/10 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:px-16 lg:py-32">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9a783]">
                        01 — Who We Are
                    </p>
                    <p className="mt-5 text-sm text-white/40">
                        A considered approach to design.
                    </p>
                </div>

                <div>
                    <h2 className="max-w-3xl text-3xl font-light leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                        Kami tidak sekadar membuat visual.
                        <span className="text-white/40">
                            {" "}
                            Kami membantu Anda melihat potensi sebuah gagasan.
                        </span>
                    </h2>

                    <div className="mt-8 grid gap-6 text-sm leading-7 text-white/60 sm:grid-cols-2 sm:gap-8">
                        <p>
                            NextCAD Studio merupakan studio desain yang berfokus pada
                            arsitektur, visualisasi 3D, desain interior, dan pemodelan CAD.
                            Kami menggabungkan kepekaan visual dengan pendekatan kerja yang
                            sistematis agar ide dapat dikomunikasikan dengan lebih jelas.
                        </p>
                        <p>
                            Kami percaya bahwa kerja sama yang baik dimulai dari pemahaman
                            yang tepat. Karena itu, kami mengutamakan komunikasi, ketelitian,
                            dan keselarasan antara tujuan proyek dengan hasil desain yang
                            dikembangkan.
                        </p>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section
                id="expertise"
                className="scroll-mt-20 border-b border-white/10 px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28"
            >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9a783]">
                            02 — Our Expertise
                        </p>
                        <h2 className="mt-5 max-w-2xl text-4xl font-light tracking-[-0.04em] sm:text-5xl">
                            Design with purpose.
                            <br />
                            <span className="text-white/40">Precision in every detail.</span>
                        </h2>
                    </div>

                    <p className="max-w-sm text-sm leading-7 text-white/50">
                        Layanan yang dirancang untuk membantu kebutuhan proyek dari
                        eksplorasi konsep hingga komunikasi visual dan teknis.
                    </p>
                </div>

                <div className="mt-14 border-t border-white/15">
                    {services.map((service) => (
                        <article
                            key={service.number}
                            className="group grid gap-4 border-b border-white/15 py-7 transition-colors sm:grid-cols-[70px_1fr_1fr] sm:items-start sm:gap-8 sm:py-9"
                        >
                            <span className="text-xs tracking-[0.15em] text-[#b9a783]">
                                {service.number}
                            </span>

                            <h3 className="text-xl font-light tracking-tight transition-colors group-hover:text-[#d6c5a0] sm:text-2xl">
                                {service.title}
                            </h3>

                            <p className="max-w-lg text-sm leading-7 text-white/50">
                                {service.description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {/* APPROACH */}
            <section className="grid gap-12 border-b border-white/10 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:px-16 lg:py-28">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9a783]">
                        03 — How We Work
                    </p>
                    <h2 className="mt-5 text-4xl font-light leading-tight tracking-[-0.04em] sm:text-5xl">
                        Clear process.
                        <br />
                        <span className="text-white/40">Thoughtful results.</span>
                    </h2>
                    <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
                        Proses kerja yang terstruktur membantu setiap pihak memahami arah,
                        tahapan, dan kebutuhan proyek sejak awal.
                    </p>
                </div>

                <div className="border-t border-white/15">
                    {process.map(([number, title, description]) => (
                        <div
                            key={number}
                            className="grid grid-cols-[38px_1fr] gap-4 border-b border-white/15 py-6 sm:grid-cols-[50px_1fr] sm:gap-6 sm:py-7"
                        >
                            <span className="pt-1 text-xs text-[#b9a783]">{number}</span>
                            <div>
                                <h3 className="text-lg font-medium">{title}</h3>
                                <p className="mt-2 max-w-lg text-sm leading-7 text-white/50">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PARTNERSHIP CTA */}
            <section
                id="contact"
                className="relative scroll-mt-20 overflow-hidden px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32"
            >
                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-600/[0.10] blur-[100px]" />

                <div className="relative grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9a783]">
                            04 — Let’s Collaborate
                        </p>
                        <h2 className="mt-6 max-w-4xl text-4xl font-light leading-[1.12] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                            Your vision.
                            <br />
                            Our design expertise.
                            <br />
                            <span className="text-white/40">A shared ambition.</span>
                        </h2>
                        <p className="mt-7 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
                            Setiap proyek memiliki tantangan dan peluang yang berbeda.
                            Mari diskusikan kebutuhan Anda dan temukan pendekatan desain
                            yang tepat untuk mewujudkan tujuan proyek bersama NextCAD Studio.
                        </p>
                    </div>

                    <a
                        href={whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-5 border border-[#b9a783]/60 px-6 py-5 text-xs font-semibold uppercase tracking-[0.13em] text-[#dfcfac] transition hover:bg-[#c5b28d] hover:text-[#171511]"
                    >
                        Start a Conversation <span className="text-base">↗</span>
                    </a>
                </div>

                <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-6 text-[10px] uppercase tracking-[0.18em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
                    <span>NextCAD Studio</span>
                    <span>Designed with intention. Built on collaboration.</span>
                </div>
            </section>
        </main>
    );
}