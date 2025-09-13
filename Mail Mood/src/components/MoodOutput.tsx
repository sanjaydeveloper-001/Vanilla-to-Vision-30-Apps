import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'

type Props = {
        subject : string,
        footer : string,
        onReset: () => void
    }

function MoodOutput({ subject , footer , onReset }:Props ) {

  return (
    <div className='space-y-4'>
        <div>
            <label className='block font-medium' >Subject :</label>
            <Input value={subject} />
        </div>
        <div>
            <label className='block font-medium' >Your Thoughts :</label>
            <Textarea value={footer} />
        </div>

        <Button className='w-full' variant="destructive" onClick={onReset} >Reset</Button>
    </div>
  )
}

export default MoodOutput