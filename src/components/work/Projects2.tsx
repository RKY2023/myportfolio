
import Link from 'next/link'
import { Accordion } from "@/once-ui/components";


const FULLSTACK_PROJECTS = [
  {
    id: 0,
    name: 'Group Chat App',
    url: 'https://group-chat-app-sigma.vercel.app/',
  },
  {
    id: 1,
    name: 'Expense tracker',
    url: 'http://16.170.117.21/',
  }
]

const WEB_PROJECTS = [
  {
    id: 0,
    name: 'Ashboard',
    url: 'https://ashboard-ruby.vercel.app/',
    desc: '',
  },
  {
    id: 1,
    name: 'Expense tracker',
    // url: 'https://expensetracker-7505d.web.app/',
    url: 'https://expense.rajkumaryd.in/',
  },
  // {
  //   id: 2,
  //   name: 'Mailbox',
  //   url: 'https://mailboxx-72dc0.web.app/',
  // },
  {
    id: 3,
    name: 'Ecommerce',
    // url: 'https://atomic-matrix-193707.web.app/',
    url: 'https://viand.vercel.app/',
  },
  // {
  //   id: 4,
  //   name: 'Meetups',
  //   url: 'https://meetups.rajkumaryd.in/',
  // }
]

const PY_PROJECTS = [
  {
    id: 0,
    name: 'Django Ashboard Backend',
    url: 'https://ashback.rajkumaryd.in/',
  },
  {
    id: 1,
    name: 'Auto Anime Downloader',
    url: 'https://github.com/RKY2023/AutoAnimeDownload',
  },
  // {
  //   id: 1,
  //   name: 'Manga Downloader (private repo)',
  //   url: '',
  // },
  // {
  //   id: 2,
  //   name: 'Bank Account statement Pdf to CSV (private repo)',
  //   url: '',
  // }
]

function Projects2() {
  
  const projectContent = (projectList: { id: number; name: string; url: string; desc?: string }[]) => {
    return projectList.map(proj => {
      const body = <Link href={proj.url}>{proj.url}</Link>
      return (
        <Accordion title={proj.name}>{body}</Accordion>
      );
    })
  }


  return (
<>

<div className={`flex flex-col p-10`}>
<div className="col">
    <h1 className='m-2 text-center'>
        Fullstack Projects
    </h1>
    <div>
      {projectContent(FULLSTACK_PROJECTS)}
    </div>
  </div>
  <div className="col">
    <h1 className='m-2 text-center'>
        React Projects
    </h1>
    <div>
      {projectContent(WEB_PROJECTS)}
    </div>
  </div>
  <div className="col">
    <h1 className='m-2 text-center'>
        Python Projects
    </h1>
    <div>
      {projectContent(PY_PROJECTS)}
    </div>
  </div>
</div>
</>
  )
}

export default Projects2