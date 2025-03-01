import { useEffect } from "react";
import { Link } from 'react-router-dom'
import Accordion from "../component/UI/Accordion/Accordion";


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
    url: 'https://expensetracker-7505d.web.app/',
  },
  {
    id: 2,
    name: 'Mailbox',
    url: 'https://mailboxx-72dc0.web.app/',
  },
  {
    id: 3,
    name: 'Ecommerce',
    url: 'https://atomic-matrix-193707.web.app/',
  },
  {
    id: 4,
    name: 'Meetups',
    url: 'https://meetups.rajkumaryd.in/',
  }
]

const PY_PROJECTS = [
  {
    id: 0,
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

function Projects() {
  
  const projectContent = (projectList) => {
    return projectList.map(proj => {
      const body = <Link to={proj.url}>{proj.url}</Link>
      return (
        <Accordion head={proj.name} body={body}/>
      );
    })
  }
  
  useEffect(() => {
    const bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.setAttribute('data-bs-theme','dark');
    localStorage.setItem('theme','dark');        
  },[]);

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

export default Projects