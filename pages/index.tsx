import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Nav from "../components/Nav.jsx";
import { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [newGreeting, setNewGreeting] = useState('');

  async function runTransaction() {
    const transactionId = await fcl.mutate({
      cadence: `
      import HelloWorld from 0x741dac035a02ca4e
  
      transaction(myNewGreeting: String) {
  
        prepare(signer: AuthAccount) {}
  
        execute {
          HelloWorld.changeGreeting(newGreeting: myNewGreeting)
        }
      }
      `,
      args: (arg, t) => [
        arg(newGreeting, t.String)
      ],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999
    })
  
    console.log("Here is the transactionId: " + transactionId);
    await fcl.tx(transactionId).onceSealed();
    executeScript();
  }


  async function executeScript() {
    const response = await fcl.query({
      cadence: ` import HelloWorld from 0x741dac035a02ca4e

    pub fun main(): String {
        return HelloWorld.greeting
    }
    `, 
      args: (arg, t) => [] // ARGUMENTS GO IN HERE
    })
  
    
    setGreeting(response);
  }

  useEffect(() => {
    executeScript()
  }, [])

  function printGoodbye() {
    console.log("Goodbye!")
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Emerald DApp</title>
        <meta name="description" content="Created by Emerald Academy" />
        <link rel="icon" href="https://i.imgur.com/hvNtbgD.png" />
      </Head>
      <Nav />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to my <a href="https://academy.ecdao.org" target="_blank">Emerald DApp!</a>
        </h1>
        <p>This is Dapp is created by Andrew</p>
        <div className={styles.flex}>
        <button onClick={runTransaction}>Run Transaction</button>
        <input onChange={(e) => setNewGreeting(e.target.value)} placeholder="Hello, Idiots!" />
        </div>
        <p>{greeting}</p>
      </main>
    </div>
  )
}