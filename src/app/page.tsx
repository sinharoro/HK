export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-slate-900/80 px-6 py-3 backdrop-blur-md">
        <span className="text-lg font-bold text-white">HUSTISYAKONEK</span>
        <a href="/login" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
          Sign In
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 text-center text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative z-10 max-w-4xl">
          <div className="mb-6 inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm">
            Barangay Napolan, Pagadian City &mdash; Thesis Project 2026
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-blue-400">HUSTISYA</span>KONEK
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-blue-100/80 sm:text-xl">
            A Web-Based Summon Issuance and Case Management System for the
            Lupong Tagapamayapa of Barangay Napolan, Pagadian, Zamboanga del Sur
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/login"
              className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40"
            >
              Login to Dashboard
            </a>
            <a
              href="#about"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="h-6 w-6 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white px-4 py-20 dark:bg-slate-950 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Background of the Study
          </h2>
          <div className="mx-auto mb-12 h-1 w-20 rounded-full bg-blue-600" />
          <div className="space-y-5 text-justify text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            <p>
              Access to justice at the community level is a cornerstone of democratic governance. In the Philippines, the
              Katarungang Pambarangay (KP) allows residents to settle disputes through mediation, conciliation, and
              arbitration at the barangay level without immediately going to court. Overseen by the Lupon
              Tagapamayapa&mdash;a body chaired by the Punong Barangay and composed of ten to twenty elected
              members&mdash;the system was established under Presidential Decree No. 1508 in 1977 and later revised by
              the Local Government Code of 1991 or Republic Act No. 7160.
            </p>
            <p>
              Despite the broader push for digitalization, many barangays&mdash;including Barangay Napolan, Pagadian
              City, Zamboanga del Sur&mdash;continue to rely on manual, paper-based processes for KP operations. The
              Barangay Secretary currently handles all case documentation and summon preparation by hand, creating
              bottlenecks and delays. Case assignments and hearing schedules are relayed verbally with no written record,
              summons are delivered by barangay tanods whose availability is unpredictable, and case records exist only
              as handwritten logbook entries.
            </p>
            <p>
              To address these issues, the researchers propose the development of <strong>HustisyaKonek</strong>: a
              system that centralizes case documentation, ensures proper recording and retrieval of summon and settlement
              records, and connects officials through digital notifications. It also allows complainants to register
              accounts to file complaints online, while respondents receive credentials via printed summons slips.
            </p>
          </div>
        </div>
      </section>

      {/* Project Context */}
      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Project Context
          </h2>
          <div className="mx-auto mb-12 h-1 w-20 rounded-full bg-blue-600" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Digital Complaint Filing",
                desc: "Register complaints and encode all party information in a structured digital format.",
              },
              {
                title: "Automated Summon Generation",
                desc: "Generate formatted, printable summons with respondent login credentials.",
              },
              {
                title: "Case Assignment & Tracking",
                desc: "Assign cases to Lupon members and track through stages: Filed, Under Mediation, Settled, Escalated, or Closed.",
              },
              {
                title: "Attendance Recording",
                desc: "Record attendance of complainants, respondents, and Lupon members to strengthen accountability.",
              },
              {
                title: "Audit Logging",
                desc: "Maintain a digital audit log of all actions for transparency and due process.",
              },
              {
                title: "Filing of Action Reports",
                desc: "Generate standardized Filing of Action reports for unresolved cases to escalate to the PNP.",
              },
              {
                title: "Lupon Coordination Module",
                desc: "Automatically notify the Lupon Chairman and assigned members of new case assignments, hearing schedules, and status changes.",
              },
              {
                title: "Account-Based Access",
                desc: "Complainants register accounts; respondents receive credentials via printed summons slips. Both can view their dashboard with digital copies of summons and case progress.",
              },
              {
                title: "SMS & Email Notifications",
                desc: "Optional supplementary notifications when contact information is available, while printed summons remain the primary legal notice.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white px-4 py-20 dark:bg-slate-950 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Purpose &amp; Description
          </h2>
          <div className="mx-auto mb-12 h-1 w-20 rounded-full bg-blue-600" />
          <p className="mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            The primary purpose of this project is to assist the Lupong Tagapamayapa of Barangay Napolan in managing
            Katarungang Pambarangay cases and summon issuance through a simplified and automated digital platform,
            replacing traditional manual methods with a user-friendly web application.
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8 dark:border-blue-900/50 dark:bg-blue-950/30">
              <h3 className="mb-4 text-xl font-bold text-blue-800 dark:text-blue-300">For the Barangay Secretary</h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Registers complaints &amp; encodes party details
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Generates and prints summons
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Updates case statuses and generates reports
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Centralized, searchable database
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8 dark:border-blue-900/50 dark:bg-blue-950/30">
              <h3 className="mb-4 text-xl font-bold text-blue-800 dark:text-blue-300">For Lupon Officials</h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Oversees case assignments &amp; hearing schedules
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> In-system notifications for updates
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Automatic alerts for assigned cases
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Sufficient notice to review case details
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8 dark:border-blue-900/50 dark:bg-blue-950/30">
              <h3 className="mb-4 text-xl font-bold text-blue-800 dark:text-blue-300">For Complainants</h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Register accounts to file complaints online
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> View digital copies of summons
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Check hearing schedules &amp; case progress
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Data privacy and transparency
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8 dark:border-blue-900/50 dark:bg-blue-950/30">
              <h3 className="mb-4 text-xl font-bold text-blue-800 dark:text-blue-300">For Respondents</h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Receive login credentials via printed summons
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Dashboard access to case details
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> View hearing schedules
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">&#10003;</span> Track case progress
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Objectives
          </h2>
          <div className="mx-auto mb-12 h-1 w-20 rounded-full bg-blue-600" />
          <div className="mx-auto mb-12 max-w-3xl text-center text-lg text-slate-600 dark:text-slate-300">
            <p>
              This project aims to develop HustisyaKonek with the goal of replacing the current manual, paper-driven
              processes used in handling Katarungang Pambarangay cases with a more efficient and accountable digital
              alternative.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                num: "01",
                title: "Identify Inefficiencies",
                desc: "Identify the current inefficiencies in Barangay Napolan's manual Katarungang Pambarangay workflow, particularly in complaint filing, summon issuance, case recording, retrieval, attendance, and progress reporting.",
              },
              {
                num: "02",
                title: "Develop the System",
                desc: "Develop a centralized web-based system with modules for account registration, complaint filing, summon generation, Lupon coordination, reminder notifications, attendance tracking, audit logging, and structured case management.",
              },
              {
                num: "03",
                title: "Assess & Evaluate",
                desc: "Assess the system's functionality, usability, security, and performance using recognized software evaluation criteria to ensure efficiency, accountability, and data protection.",
              },
            ].map((obj) => (
              <div key={obj.num} className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
                <span className="mb-4 block text-4xl font-bold text-blue-600 dark:text-blue-400">{obj.num}</span>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">{obj.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope & Limitation */}
      <section className="bg-white px-4 py-20 dark:bg-slate-950 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Scope &amp; Limitation
          </h2>
          <div className="mx-auto mb-12 h-1 w-20 rounded-full bg-blue-600" />
          <div className="space-y-5 text-justify text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            <p>
              HustisyaKonek is specifically built for the Katarungang Pambarangay case management and summon issuance
              workflow of Barangay Napolan, Pagadian, Zamboanga del Sur. It supports three internal user
              roles&mdash;the Barangay Secretary, the Lupon Chairman, and the Lupon Members or Pangkat
              Tagapagkasundo&mdash;and provides external access to complainants and respondents through registered
              accounts.
            </p>
            <p>
              The system covers complaint filing, summon generation, Lupon coordination and notification, attendance
              tracking, audit logging, reminder notifications for hearings, and automated Filing of Action report
              generation. All records are securely stored with role-based access and encryption.
            </p>
            <p>
              The system runs through a web browser and is designed to operate within the barangay's local server
              environment. Printed summons and reminders remain the primary legal notice, while SMS and email
              notifications are optional supplementary tools.
            </p>
            <p>
              The system is not intended to cover other barangay administrative services such as resident records
              management, clearance issuance, or civil registration. Escalation to the PNP remains manual, with the
              Barangay Secretary printing and submitting the Filing of Action report.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            The Team
          </h2>
          <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-blue-600" />
          <p className="mb-12 text-center text-lg text-slate-500 dark:text-slate-400">
            Executable Trinity (TRI.EXE)
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { name: "Arth A. Dablo", role: "Member" },
              { name: "Angel E. Rosal", role: "Member" },
              { name: "Jenevive D. Sanchez", role: "Member" },
            ].map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <div className="inline-block rounded-2xl border border-blue-100 bg-blue-50/50 px-8 py-6 dark:border-blue-900/50 dark:bg-blue-950/30">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Adviser</p>
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Mrs. Shinie Kie Avila-Dangasi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-2 text-lg font-bold text-blue-600 dark:text-blue-400">HUSTISYAKONEK</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Barangay Napolan, Pagadian City, Zamboanga del Sur
          </p>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Executable Trinity (TRI.EXE). All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
