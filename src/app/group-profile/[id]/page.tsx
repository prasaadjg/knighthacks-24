'use client'

import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';

export default function GroupProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [groupName, setGroupName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [iconUrl, setIconUrl] = useState('');

  const { data: groupData, isLoading, isError } = api.groups.getGroupName.useQuery(
    { id: Number(id) },
    {
      enabled: !!id,
    }
  );

  const { data: startData } = api.groups.getStart.useQuery({ id: Number(id) }, { enabled: !!id });
  const { data: endData } = api.groups.getEnd.useQuery({ id: Number(id) }, { enabled: !!id });
  const { data: ownerData } = api.groups.getOwner.useQuery({ id: Number(id) }, { enabled: !!id });
  const { data: iconData } = api.groups.getIconUrl.useQuery({ id: Number(id) }, { enabled: !!id });


  useEffect(() => {
    if (groupData) setGroupName(groupData.groupName);
    if (startData) setStart(startData.start);
    if (endData) setEnd(endData.end);
    if (ownerData) setOwnerId(ownerData.ownerId);
    if (iconData) setIconUrl(iconData.iconUrl);
  }, [groupData, startData, endData, ownerData, iconData]);

  if (isLoading) return <div>Loading group details...</div>;
  if (isError) return <div>Failed to load group details.</div>;

  return (
    <div>
      <h1>Group Profile</h1>

      <div>
        <h2>{groupName}</h2>
        {iconUrl && <img src={iconUrl} alt="Group Icon" width={100} />}
        <p>Start Time: {start}</p>
        <p>End Time: {end}</p>
        <p>Owner ID: {ownerId}</p>
      </div>
    </div>
  );
}