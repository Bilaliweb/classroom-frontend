import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Search} from "lucide-react";
import {useMemo, useState} from "react";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { ClassDetails, Subject, User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useList } from "@refinedev/core";

const ClassesList = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('all')
    const [selectedTeacher, setSelectedTeacher] = useState('all')

    // Fetch subjects list
    const { query: subjectsQuery } = useList<Subject>({
        resource: "subjects",
        pagination: {
            pageSize: 100,
        },
    });

    // Fetch teachers list
    const { query: teachersQuery } = useList<User>({
        resource: "users",
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "teacher",
            },
        ],
        pagination: {
            pageSize: 100,
        },
    });

    const subjects = subjectsQuery?.data?.data || [];
    const teachers = teachersQuery?.data?.data || [];

    const searchFilters = searchQuery ? [
        {field: 'name', operator: 'contains' as const, value: searchQuery}
    ] : [];
    
    const subjectFilters = selectedSubject === 'all' ? [] : [
        {field: 'subject', operator: 'eq' as const, value: selectedSubject}
    ];
    
    const teacherFilters = selectedTeacher === 'all' ? [] : [
        {field: 'teacher', operator: 'eq' as const, value: selectedTeacher}
    ];
    
    const classesTable = useTable<ClassDetails>({
        columns: useMemo<ColumnDef<ClassDetails>[]>(() => [
            {
                id: 'bannerUrl', 
                accessorKey: 'bannerUrl',
                size: 100,
                header: () => <p className="column-title ml-2">Banner</p>,
                cell: ({ getValue }) => (
                    <div className="flex items-center justify-center ml-1">
                        <img src={getValue<string>() || '/placeholder-class.png'} 
                        alt="class-banner"
                        className="w-10 h-10 rounded object-cover" />
                    </div>
                )
            },
            {
                id: 'name', 
                accessorKey: 'name',
                size: 100,
                header: () => <p className="column-title ml-2">Name</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
                filterFn: 'includesString'
            },
            {
                id: 'description', 
                accessorKey: 'description',
                size: 100,
                header: () => <span className="truncate line-clamp-2">Description</span>,
                cell: ({ getValue }) => <span>{getValue<string>()}</span>
            },
            {
                id: 'status', 
                accessorKey: 'status',
                size: 100,
                header: () => <p className="column-title ml-2">Status</p>,
                cell: ({ getValue }) => {
                    const status = getValue<string>();
                    return (
                        <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
                    )
            }
            },
            {
                id: 'capacity', 
                accessorKey: 'capacity',
                size: 100,
                header: () => <p className="column-title ml-2">Capacity</p>,
                cell: ({ getValue }) => <span>{getValue<string>()}</span>
            },
            {
                id: 'subject', 
                accessorKey: 'subjects.name',
                size: 100,
                header: () => <p className="column-title ml-2">Subject</p>,
                cell: ({ getValue }) => <span>{getValue<string>()}</span>
            },
            {
                id: 'teacher', 
                accessorKey: 'user.name',
                size: 100,
                header: () => <p className="column-title ml-2">Teacher</p>,
                cell: ({ getValue }) => <span>{getValue<string>()}</span>
            },
        ], []),
        refineCoreProps: {
            resource: 'classes',
            pagination: { pageSize: 10, mode: 'server'}, // Pagination would be from server side
            filters: {
                permanent: [...subjectFilters, ...teacherFilters, ...searchFilters]
            },
            sorters: {
                initial: [
                    { field: 'id', order: 'desc' }
                ]
            }
        }
    })
    return (
        <ListView>
            <Breadcrumb />

            <h1 className='page-title'>Classes</h1>

            <div className='intro-row'>
                <p>Classes listed below.</p>
                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select
                            value={selectedSubject}
                            onValueChange={setSelectedSubject}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Filter by subject" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects?.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.name}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={selectedTeacher}
                            onValueChange={setSelectedTeacher}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Filter by teacher" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Teachers</SelectItem>
                                {teachers.map((teacher) => (
                                    <SelectItem key={teacher.id} value={teacher.name}>
                                        {teacher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <CreateButton resource="classes" />
                    </div>
                </div>
            </div>

            <DataTable table={classesTable}></DataTable>
        </ListView>
    )
}
export default ClassesList