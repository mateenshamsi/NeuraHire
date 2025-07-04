'use client'
import React, { useEffect } from 'react'
import CreateOptions from './CreateOptions'
import { Camera, Plus, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import { useUser } from '@/app/provider'
import { Inter } from 'next/font/google'
import InterviewCard from './InterviewCard'

type User = {
  email: string
}

function LatestInterviews() {
  const [interviewList, setInterviewList] = React.useState([])
  const { user } = useUser() as { user: User | null }

  useEffect(() => {
    if (user?.email) {
      getInterviews()
    }
  }, [user])

  const getInterviews = async () => {
    try {
      const { data: interview, error } = await supabase
        .from('interview')
        .select('*')
        .eq('userEmail', user!.email) // user is guaranteed to be non-null here
        .order('createdAt', { ascending: false })
      console.log('interview', interview)
      if (interview) {
        setInterviewList(interview)
      }
    } catch (error) {
      console.error('Error fetching interviews:', error)
    }
  }

  return (
    <div className='my-5'>
      <h2 className='my-3 font-bold text-2xl'>Previously Created Interviews</h2>
      {interviewList?.length === 0 &&
        <div className='bg-white p-5 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4'>
          <Video className='text-gray-400 w-20 h-20 mx-auto' />
          <h2 className='text-lg font-bold text-center'>No Interviews Created Yet</h2>
          <Button className='mt-5 bg-purple-800'><Plus />Create New Interview</Button>
        </div>
      }
      {
         interviewList.length > 0 &&
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {interviewList.map((interview: any) => (
           <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      }
    </div>
  )
}

export default LatestInterviews
