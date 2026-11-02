'use server';
import {db,identity} from '@/lib/supabase/server';import {ballotInput} from '@/lib/validation';
export async function submitBallot(input:unknown):Promise<{ok:boolean;message:string;receipt?:string}>{
 const p=ballotInput.safeParse(input);if(!p.success)return {ok:false,message:'Choose a candidate or abstain for every office.'};
 if(process.env.ELECTION_VOTING_ENABLED!=='true')return {ok:false,message:'Voting is not enabled yet.'};
 if(!await identity())return {ok:false,message:'Please sign in again before voting.'};
 try{const c=await db();const {data,error}=await c.rpc('cast_ballot',{p_election_id:p.data.election_id,p_choices:p.data.choices});if(error){const {data:status}=await c.rpc('my_ballot_status',{p_election_id:p.data.election_id});if(status?.voted)return {ok:true,message:'Your ballot was already recorded.',receipt:status.receipt};const safe=['Voting is closed.','Voting is not enabled.','Your account is not on the approved voter list.','Choose a candidate or abstain for every office.','Invalid candidate.','Invalid office.','Duplicate or missing office.'];return {ok:false,message:safe.includes(error.message)?error.message:'Your ballot was not recorded. Please check your choices and try again.'};}return {ok:true,message:'Your ballot has been recorded.',receipt:data};}catch{return {ok:false,message:'We couldn’t confirm the result. Refresh this page to check your ballot status before retrying.'};}
}
