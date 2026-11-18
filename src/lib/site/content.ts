export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "link"; text: string; href: string; affiliate?: boolean }
  | { type: "img"; src: string; alt: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  blocks: Block[];
};

export const PUBLISHER = "MadoTrak";
export const PUBLISHER_PLACE = "Philadelphia, Pennsylvania";
export const CONTACT_EMAIL = "Samad@samadrobinson.com";
export const POLICY_UPDATED = "October 20, 2026";

export const posts: Post[] = [
  {
    slug: "a-raise-is-not-take-home",
    title: "A raise is not the amount that hits your account",
    description: "A higher hourly wage raises the gross check by more than it raises take-home.",
    date: "November 16, 2026",
    blocks: [
      {
        type: "p",
        text: "A $2 raise sounds like $2 more for every hour on the check. Gross pay does work that way. Take-home does not. Federal income tax, Social Security, Medicare, and any state tax apply to the extra dollars. The amount that reaches the account is the raise minus those lines.",
      },
      {
        type: "h2",
        text: "Forty hours at $20, then at $22",
      },
      {
        type: "p",
        text: "On a weekly check, 40 hours at $20 is $800 gross. The same 40 hours at $22 is $880 gross. The raise is $80 on that check, or $4,160 over a 52-week year if the hours stay full. In this estimate, for a single filer in Pennsylvania with no local tax, no 401(k), and no health premium, take-home moves from about $660 to about $722. About $62 of the $80 shows up. The other $18 is tax. A $1 raise, from $20 to $21, is $40 more gross and about $31 more take-home on that same check.",
      },
      {
        type: "h2",
        text: "Why the whole raise is not taxed at one rate",
      },
      {
        type: "p",
        text: "Social Security is 6.2 percent of the extra wages, and Medicare is 1.45 percent, until a wage hits a limit the calculator already applies. Federal income tax takes a slice of the extra taxable dollars at the bracket those dollars fall in, not a slice of the whole paycheck. Pennsylvania’s wage tax in this estimate is a flat percent on top. None of those rates is a reason to skip a raise. They are the reason a budget should use the new take-home, not the new wage times the hours.",
      },
      {
        type: "p",
        text: "Type the old wage and the new wage into the calculator with the same hours, filing status, and state. The gap between the two take-home numbers is the raise you can spend. It is an estimate, not a pay stub and not tax advice. The [Internal Revenue Service](https://www.irs.gov) publishes the federal pieces this estimate is drawn from.",
      },
    ],
  },
  {
    slug: "same-wage-four-pay-schedules",
    title: "Same wage, four different checks",
    description: "Weekly, every two weeks, twice a month, and monthly change the size of the check, not the year.",
    date: "November 10, 2026",
    blocks: [
      {
        type: "p",
        text: "A job that pays $20 an hour does not produce one check size. It produces four, depending on how often you are paid. The year is the same if you work full time all year. The envelope is not.",
      },
      {
        type: "h2",
        text: "One wage, four gross checks",
      },
      {
        type: "ul",
        items: [
          "Weekly: 40 hours, $800 gross. About 52 checks.",
          "Every two weeks: 80 hours, $1,600 gross. About 26 checks.",
          "Twice a month: 86.67 hours, about $1,733 gross. 24 checks.",
          "Monthly: 173.33 hours, about $3,467 gross. 12 checks.",
        ],
      },
      {
        type: "p",
        text: "Those four gross amounts are the same job. Each one is about $41,600 for the year. A monthly check looks large because it is holding a month of pay. A weekly check looks small because it is holding a week. Comparing a friend’s monthly deposit with your weekly deposit, without multiplying by how often you are paid, is the usual mix-up.",
      },
      {
        type: "h2",
        text: "Take-home follows the check, not a new tax",
      },
      {
        type: "p",
        text: "The calculator annualizes whatever check you enter, then splits the year’s tax back onto that check. If the hours match the pay schedule, the yearly take-home barely moves. In this estimate, $20 an hour, single, Pennsylvania, no local tax and no deductions, each of those four schedules leaves about $34,330 for the year. One week of it is about $660. One month of it is about $2,861. Same year, different payday.",
      },
      {
        type: "p",
        text: "The estimate breaks when the hours do not match the schedule. Forty hours marked monthly is treated as a thin year. Eighty hours marked weekly is treated as constant overtime. Pick the schedule on the stub, then enter the hours on that one check. This is an estimate for planning, not a pay stub and not tax advice.",
      },
    ],
  },
  {
    slug: "a-second-job",
    title: "A second job",
    description: "Adding two take-home estimates makes the tax look too low. One combined check is closer.",
    date: "November 3, 2026",
    blocks: [
      {
        type: "p",
        text: "Each employer withholds as if that job were your only job. Run the calculator twice, once for each check, and the two take-home numbers will not add up to the year. Each run applies the standard deduction and the lower tax brackets on its own. A real year gets one standard deduction, and the brackets apply to the wages from both jobs together. The two separate estimates usually show too little tax and too much take-home.",
      },
      {
        type: "h2",
        text: "A weekly example",
      },
      {
        type: "p",
        text: "Job A pays $20 an hour for 30 hours, or $600 a week. Job B pays $18 an hour for 15 hours, or $270 a week. Estimated alone, each check is taxed as a modest income. Together they are $870 a week, about $45,000 a year before overtime. That combined year can sit in a higher federal bracket than either job would on its own. Social Security and Medicare are still a percent of wages. They do not get a second standard deduction, so those lines are less misleading than the income-tax line when you add two checks.",
      },
      {
        type: "h2",
        text: "Put both jobs on one check",
      },
      {
        type: "p",
        text: "Add the gross pay from both jobs for the same stretch of time, then enter that as one paycheck. In the example, $870 a week is 40 hours at $21.75, or 30 hours at $29. Either pair is fine. The calculator only needs the gross for that period. Use the same filing status you expect to use on the return. The result is still an estimate, but it taxes the combined wages once instead of twice.",
      },
      {
        type: "p",
        text: "Pay schedules that do not match are the awkward part. A weekly job and a check every two weeks do not share a payday. Add two weeks of the weekly job to one biweekly check, or convert both to a yearly gross and divide by 52, before you type the wage and hours.",
      },
      {
        type: "h2",
        text: "What the calculator still will not do",
      },
      {
        type: "p",
        text: "It will not split the withholding between the two employers. It will not know that one job already used part of your standard deduction. If the second job is tips, a 1099, or self-employment, this hourly estimate does not apply. Self-employment tax is a different bill. None of this is tax, payroll, or legal advice.",
      },
      {
        type: "p",
        text: "The [Internal Revenue Service](https://www.irs.gov) explains withholding on [Form W-4](https://www.irs.gov/forms-pubs/about-form-w-4). Extra withholding on the higher-paying job is the usual way people close the gap. Compare that with a real stub before you rely on the number.",
      },
    ],
  },
  {
    slug: "hourly-wage-to-take-home",
    title: "From an hourly wage to take-home pay",
    description: "What happens between the hours on a timesheet and the amount that lands in the account.",
    date: "October 20, 2026",
    blocks: [
      {
        type: "p",
        text: "Gross pay is the simple part. Multiply the hourly wage by the hours on that paycheck. If the check also has overtime, those hours are paid at the overtime rate, usually time-and-a-half, and added on. Take-home pay is what remains after taxes and the deductions you actually have.",
      },
      {
        type: "h2",
        text: "One check stands in for the year",
      },
      {
        type: "p",
        text: "Income tax is not a flat percent of a single week. Takehome annualizes the check. A weekly paycheck is treated as if that same check arrived 52 times. A check every two weeks is treated as 26 times, twice a month as 24, and monthly as 12. That yearly figure is what the federal brackets and the standard deduction are applied to. The tax for the year is then split back into one paycheck.",
      },
      {
        type: "p",
        text: "That method is a useful estimate when your hours are steady. It is less accurate for a one-off heavy week, a seasonal job, or a year when you change jobs. A fat overtime week, stretched across a full year, can push the estimate into a higher bracket than you will actually land in.",
      },
      {
        type: "h2",
        text: "What comes out before you are paid",
      },
      {
        type: "ul",
        items: [
          "Federal income tax, after the 2026 standard deduction for your filing status.",
          "Social Security at 6.2 percent of wages that count for FICA, up to the annual wage base.",
          "Medicare at 1.45 percent, plus an extra 0.9 percent only after a high wage threshold.",
          "State income tax, when that state taxes wages. A few states do not.",
          "A local wage tax only if you enter a rate. Philadelphia and New York City are presets, not automatic.",
          "Retirement and health amounts you type in. A traditional 401(k) percent reduces federal income tax. Health premiums entered here are treated as pre-tax and also reduce Social Security and Medicare wages.",
        ],
      },
      {
        type: "p",
        text: "The calculator does not know about tax credits, extra jobs, tips that were not in the hourly wage, or a spouse’s income unless you account for that income yourself. Read the result as a planning number, then compare it with a real pay stub.",
      },
    ],
  },
  {
    slug: "overtime-on-a-paycheck",
    title: "How overtime changes a paycheck",
    description: "Time-and-a-half raises the gross check. Federal tax may drop on the extra half.",
    date: "October 20, 2026",
    blocks: [
      {
        type: "p",
        text: "Overtime is not a separate tax. It is extra wages. On Takehome, regular hours are paid at the hourly wage and overtime hours are paid at that wage times the multiplier. The default multiplier is 1.5, which is time-and-a-half. You can change it if a contract uses a different rate.",
      },
      {
        type: "h2",
        text: "A weekly example",
      },
      {
        type: "p",
        text: "Someone paid $20 an hour for 40 hours earns $800 gross. Ten more hours at time-and-a-half are 10 × $30, or $300. The check is $1,100 gross before anything is withheld. Because the estimate assumes that larger check repeats all year, the federal tax on an overtime-heavy week will look higher than the tax on a normal week.",
      },
      {
        type: "p",
        text: "For 2025 through 2028, the federal return can deduct the extra half of time-and-a-half, not the whole overtime check. The cap is $12,500 a year, or $25,000 on a joint return, and it shrinks after $150,000 of income ($300,000 joint). Takehome puts that deduction on the federal income-tax line when the limits allow it. Pay above time-and-a-half, such as double time, only counts the half that federal overtime law requires. Social Security, Medicare, and state tax still apply to the full overtime pay. Married filing separately cannot claim the deduction. A pay stub may still withhold federal tax on that premium until it is claimed on the return.",
      },
      {
        type: "h2",
        text: "Hours belong to one paycheck",
      },
      {
        type: "p",
        text: "Enter the hours for the paycheck you are looking at, not the hours for the whole month, unless you are paid monthly. A weekly full-time schedule is about 40 hours. Every two weeks is about 80. Twice a month is about 86.67, and monthly is about 173.33. Mixing those up is the most common way to get a take-home number that cannot match a stub.",
      },
      {
        type: "p",
        text: "Some jobs pay daily overtime, double time after 12 hours, or a different rate on Sunday. The multiplier field is there for that. The calculator will not apply those rules by itself.",
      },
    ],
  },
  {
    slug: "federal-tax-and-fica-2026",
    title: "Federal income tax and FICA on a 2026 paycheck",
    description: "Why Social Security and Medicare are not the same thing as income tax.",
    date: "October 20, 2026",
    blocks: [
      {
        type: "p",
        text: "A pay stub usually shows at least three federal lines: federal income tax, Social Security, and Medicare. They are calculated differently, and a raise does not move all three the same way.",
      },
      {
        type: "h2",
        text: "Income tax uses brackets",
      },
      {
        type: "p",
        text: "Federal income tax is applied to taxable wages after the standard deduction for 2026. Takehome uses the deduction for single, married filing jointly, married filing separately, or head of household. The part of income inside each bracket is taxed at that bracket’s rate. Only the dollars above a threshold are taxed at the next rate. Being “in” the 22 percent bracket does not mean the whole paycheck is taxed at 22 percent.",
      },
      {
        type: "p",
        text: "The calculator does not itemize deductions and does not apply credits such as the child tax credit. If those matter in your household, the real withholding can be lower than this estimate.",
      },
      {
        type: "h2",
        text: "FICA is a separate set of taxes",
      },
      {
        type: "p",
        text: "Social Security is 6.2 percent of wages that count for FICA, and it stops for the year after wages pass the Social Security wage base. Medicare is 1.45 percent and does not stop. An additional Medicare tax of 0.9 percent applies only after wages pass a threshold that depends on filing status. A traditional 401(k) deferral lowers income tax in this estimate, but it does not lower Social Security or Medicare. Pre-tax health premiums do lower the FICA wage base here.",
      },
      {
        type: "p",
        text: "Employers pay their own share of Social Security and Medicare. That share never appears in take-home pay, so it is not shown.",
      },
    ],
  },
  {
    slug: "philadelphia-and-pennsylvania",
    title: "A Pennsylvania paycheck, including Philadelphia",
    description: "The state tax is flat. The city wage tax is separate, and a 401(k) does not erase either one.",
    date: "October 20, 2026",
    blocks: [
      {
        type: "p",
        text: "Pennsylvania taxes wages at a flat rate. In this calculator that rate is 3.07 percent. There is no bracket to climb. If you live or work in Philadelphia, the city wage tax is extra. It is not included until you add it. The Philadelphia preset on the calculator is 3.74 percent of gross wages. City rates can change, so compare the preset with the rate on a current pay stub before you rely on it.",
      },
      {
        type: "h2",
        text: "Retirement deferrals are still taxed by Pennsylvania",
      },
      {
        type: "p",
        text: "A traditional 401(k) contribution usually reduces federal taxable wages. Pennsylvania does not let that same deferral reduce the state wage base. Takehome keeps the state tax on the higher wage even when a 401(k) percent is filled in. The federal line still drops. Social Security and Medicare do not drop because of the 401(k).",
      },
      {
        type: "h2",
        text: "Other Pennsylvania towns",
      },
      {
        type: "p",
        text: "Many townships and school districts collect an earned income tax, often around 1 percent, sometimes higher. Those local rates are not built in. Put the rate from your stub into the local wage tax field. Leave it blank if the stub shows no local tax.",
      },
    ],
  },
  {
    slug: "what-the-estimate-leaves-out",
    title: "What a paycheck estimate leaves out",
    description: "The gaps that make a careful estimate different from a payroll department.",
    date: "October 20, 2026",
    blocks: [
      {
        type: "p",
        text: "Payroll software uses withholding tables, a Form W-4, benefit elections, and sometimes a local tax code tied to an address. Takehome uses the numbers you type and a simplified estimate based on publicly available tax information. The two will be close for a straightforward hourly job and further apart when the year is complicated. These figures are not an official government calculation. See the [Internal Revenue Service](https://www.irs.gov).",
      },
      {
        type: "h2",
        text: "Not included unless you type it",
      },
      {
        type: "ul",
        items: [
          "Tax credits, including the child tax credit and dependent care credit.",
          "Itemized deductions. The estimate always uses the standard deduction.",
          "A second job, a spouse’s wages, or self-employment tax.",
          "Pre-tax commuter benefits, wage garnishments, union dues, and Roth 401(k) contributions. A Roth contribution is after tax. Put that kind of deduction in the after-tax field so it does not reduce the tax estimate.",
          "State disability insurance, paid family leave, and local taxes other than the rate you enter.",
          "The difference between withholding and the tax you owe in April.",
        ],
      },
      {
        type: "p",
        text: "Graduated state taxes are an estimate of a typical worker’s rate range, not the state’s official withholding table. If you know the flat rate your payroll actually uses, type it into the state override and leave the built-in estimate behind.",
      },
      {
        type: "p",
        text: "None of this is tax, payroll, or legal advice. Use it to plan a budget or to read a stub, then confirm anything that changes how you file.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export const faqs: { question: string; answer: string }[] = [
  {
    question: "Will this match my pay stub exactly?",
    answer:
      "Usually not to the penny. This is an estimate that annualizes one paycheck using publicly available tax information, including federal brackets and the standard deduction, plus a simplified state estimate. It is not official withholding and it is not tax advice. Payroll uses your W-4, benefit elections, and its own tables. Compare the lines, and use the override fields when your stub shows a different rate.",
  },
  {
    question: "Which hours should I enter?",
    answer:
      "Enter the hours on one paycheck. Weekly full-time work is about 40 hours. Every two weeks is about 80. Twice a month is about 86.67. Monthly is about 173.33. Put overtime in its own field.",
  },
  {
    question: "What does the overtime rate mean?",
    answer:
      "It is a multiplier on your hourly wage. 1.5 means time-and-a-half. Regular hours stay at your normal wage. Only the overtime hours use the multiplier. The 2026 federal deduction, when it applies, uses only the extra half of time-and-a-half. It does not remove Social Security, Medicare, or state tax.",
  },
  {
    question: "Does a 401(k) lower every tax?",
    answer:
      "In this estimate, a traditional 401(k) percent lowers federal income tax. It does not lower Social Security or Medicare. In Pennsylvania it also does not lower state income tax. Health premiums entered in the health field are treated as pre-tax and do lower income tax and FICA.",
  },
  {
    question: "Why is my state tax zero?",
    answer:
      "A few states do not tax wages. Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming are set up that way here. Every other state uses a flat rate or a simplified graduated estimate.",
  },
  {
    question: "How do I add Philadelphia or New York City tax?",
    answer:
      "Open Deductions and local tax. Philadelphia’s preset is 3.74 percent and New York City’s preset is 3.876 percent. Those rates are not applied just because you picked Pennsylvania or New York. Local rates change, so check them against your stub.",
  },
  {
    question: "Do you keep what I type?",
    answer:
      "The numbers stay in this browser so the form can reopen with your last entries. They are not sent to an account, because the calculator does not have accounts. Clearing the site data for this browser removes them. See the privacy policy for advertising cookies.",
  },
  {
    question: "Is this tax advice?",
    answer:
      "No. It is an educational estimate for a W-2 hourly paycheck. It is not a filing position, a payroll calculation, or a promise of a refund.",
  },
];
