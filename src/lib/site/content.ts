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
    description: "Time-and-a-half raises the gross check, and it also raises the tax estimate.",
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
        text: "Payroll software uses withholding tables, a Form W-4, benefit elections, and sometimes a local tax code tied to an address. Takehome uses the numbers you type and a simplified set of 2026 rules. The two will be close for a straightforward hourly job and further apart when the year is complicated.",
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
      "Usually not to the penny. The calculator annualizes this paycheck, uses 2026 federal brackets and the standard deduction, and uses a simplified state estimate. Payroll uses your W-4, benefit elections, and official withholding tables. Compare the lines, and use the override fields when your stub shows a different rate.",
  },
  {
    question: "Which hours should I enter?",
    answer:
      "Enter the hours on one paycheck. Weekly full-time work is about 40 hours. Every two weeks is about 80. Twice a month is about 86.67. Monthly is about 173.33. Put overtime in its own field.",
  },
  {
    question: "What does the overtime rate mean?",
    answer:
      "It is a multiplier on your hourly wage. 1.5 means time-and-a-half. Regular hours stay at your normal wage. Only the overtime hours use the multiplier.",
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
