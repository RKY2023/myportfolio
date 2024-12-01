import { useEffect } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { Link } from 'react-router-dom'


const FULLSTACK_PROJECTS = [
  {
    id: 0,
    name: 'Group Chat App',
    url: 'http://16.170.14.225/',
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
    url: 'https://meetups1-seven.vercel.app',
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
  
  const content = WEB_PROJECTS.map(proj => {
    return (
    <Accordion.Item eventKey={proj.id} key={proj.id}>
      <Accordion.Header>{proj.name}</Accordion.Header>
      <Accordion.Body>
        <Link to={proj.url}>{proj.url}</Link>
      </Accordion.Body>
    </Accordion.Item>
    );
  })
  const content2 = PY_PROJECTS.map(proj => {
    return (
    <Accordion.Item eventKey={proj.id} key={proj.id}>
      <Accordion.Header>{proj.name}</Accordion.Header>
      <Accordion.Body>
        <Link to={proj.url}>{proj.url}</Link>
      </Accordion.Body>
    </Accordion.Item>
    );
  })
  const content3 = FULLSTACK_PROJECTS.map(proj => {
    return (
    <Accordion.Item eventKey={proj.id} key={proj.id}>
      <Accordion.Header>{proj.name}</Accordion.Header>
      <Accordion.Body>
        <Link to={proj.url}>{proj.url}</Link>
      </Accordion.Body>
    </Accordion.Item>
    );
  })

  useEffect(() => {
    const bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.setAttribute('data-bs-theme','dark');
    localStorage.setItem('theme','dark');        
  },[]);

  return (
<>

<div className={`flex flex-col p-10`}>
  {/* <div className="col">
    <h1 className='m-2 text-center'>
        Fullstack Projects
    </h1>
    <Accordion defaultActiveKey="0">
      {content3}
    </Accordion>
  </div> */}
  <div className="col">
    <h1 className='m-2 text-center'>
        React Projects
    </h1>
    <Accordion defaultActiveKey="0">
      {content}
    </Accordion>
  </div>
  <div className="col">
    <h1 className='m-2 text-center'>
        Python Projects
    </h1>
    <Accordion defaultActiveKey="0">
      {content2}
    </Accordion>
  </div>
</div>
</>
  )
}

export default Projects