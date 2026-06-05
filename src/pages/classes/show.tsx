import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClassDetails } from "@/types";
import { useShow } from "@refinedev/core";
import { AdvancedImage } from '@cloudinary/react';
import { bannerPhoto } from "@/lib/cloudinary";

const ClassShow = () => {
    const { query } = useShow<ClassDetails>({ resource: 'classes' });

    const classDetails = query.data?.data
    const { isLoading, isError } = query

    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details" />
                    <p className="state-message">
                        {isLoading ? 'Loading class details...'
                            : isError ? 'Failed to load class details'
                                : 'Class details not found.'}
                    </p>
            </ShowView>
        )
    }

    const teacherName = classDetails.teacher?.name ?? 'Unknown'
    const teacherInitials = teacherName
    .split(' ')
    .filter(Boolean) // This will remove all empty spaces 
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teacherInitials || 'N/A')}`

    return (
        <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details" />
                    <div className="banner">
                        {classDetails.bannerUrl ? (
                            <AdvancedImage cldImg={bannerPhoto(classDetails.bannerCldPubId ?? '', classDetails.name)} />
                        ) : <div className="placeholder"/>}
                    </div>

                    <Card className="details-card">
                        <div className="details-header">
                            <div>
                                <h1>{classDetails.name}</h1>
                                <p>{classDetails.description}</p>
                            </div>

                            <div>
                                <Badge variant={'outline'}>{classDetails.capacity} spots</Badge>
                                <Badge variant={classDetails.status === 'active' ? 'default' : 'secondary'} data-status={classDetails.status}>{classDetails.status.toUpperCase()}</Badge>
                            </div>
                        </div>

                        <div className="details-grid">
                            <div className="instructor">
                                <p>Instructor</p>
                                <div>
                                    <img src={classDetails.teacher?.image ?? placeholderUrl} alt={teacherName} />
                                    <div>
                                        <p>{teacherName}</p>
                                        <p>{classDetails.teacher?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="department">
                                <p>Department</p>
                                <div>
                                    <div>
                                        <p>{classDetails.department?.name}</p>
                                        <p>{classDetails.department?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="subject">
                            <p>Subject</p>

                            <div>
                                <Badge variant={'outline'}>Code: {classDetails.subject?.code}</Badge>
                                <p>{classDetails.subject?.name}</p>
                                <p>{classDetails.subject?.description }</p>
                            </div>
                        </div>
                        
                        <Separator />

                        <div className="join">
                            <h2>Join Class</h2>

                            <ol>
                                <li>Ask your teacher for the invite code</li>
                                <li>Click on "Join Class" button</li>
                                <li>Paste the code and click "Join"</li>
                            </ol>
                        </div>

                        <Button className="w-full" size={'lg'}>Join Class</Button>
                    </Card>
            </ShowView>
    )
}

export default ClassShow;