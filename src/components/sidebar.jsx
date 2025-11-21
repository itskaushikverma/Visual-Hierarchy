import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";

import SortableList from "./sortableList";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function SidebarMenu({ node, onOpen, onOpenChange, nodes, setNodes }) {
    const [index, setindex] = useState()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editTitleDialogOpen, setEditTitleDialogOpen] = useState(false)
    const [addSection, setAddSection] = useState(false)
    const [selectedSectionId, setSelectedSectionId] = useState(null)
    const [title, setTitle] = useState("");

    const sections = nodes?.[index]?.data?.sections ?? [];

    useEffect(() => {
        if (node && nodes) {
            setindex(nodes.findIndex((n) => n.id === node.id))
        }
    }, [node, nodes, setindex, index])

    useEffect(() => {
        const newTitle = nodes?.[index]?.data?.label;
        setTitle(newTitle);
    }, [nodes, index]);

    const handleEdit = (updatedSection) => {
        if (typeof setNodes !== 'function') return;
        setNodes(prev => {
            if (!Array.isArray(prev)) return prev;
            const next = [...prev];
            if (index == null || !next[index]) return next;
            const oldSections = next[index].data?.sections ?? [];
            const newSections = oldSections.map(s => s.id === updatedSection.id ? { ...s, ...updatedSection } : s);
            const updatedNode = { ...next[index], data: { ...(next[index].data ?? {}), sections: newSections } };
            next[index] = updatedNode;
            return next;
        });
    };

    const handleDelete = (sectionId) => {
        if (typeof setNodes !== 'function') return;
        setNodes(prev => {
            if (!Array.isArray(prev)) return prev;
            const next = [...prev];
            if (index == null || !next[index]) return next;
            const oldSections = next[index].data?.sections ?? [];
            const newSections = oldSections.filter(s => s.id !== sectionId);
            const updatedNode = { ...next[index], data: { ...(next[index].data ?? {}), sections: newSections } };
            next[index] = updatedNode;
            return next;
        });
    };

    return (
        <>
            <Sheet open={onOpen} onOpenChange={onOpenChange}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>View / Edit Node</SheetTitle>
                        <SheetDescription>Hover the Mouse to View Options</SheetDescription>
                    </SheetHeader>

                    <div className="px-4">
                        <div className="flex flex-row items-center mb-2">
                            <div
                                className="border-solid border-[#11111126] dark:border-[#FFFFFF26] flex-1"
                                style={{ borderTopWidth: "1px" }}
                            />
                            <div onClick={(e) => { e.preventDefault(); setEditTitleDialogOpen(true); }} className="px-2 text-black dark:text-white flex-none">
                                {title}
                            </div>
                            <div
                                className="border-solid border-[#11111126] dark:border-[#FFFFFF26] flex-1"
                                style={{ borderTopWidth: "1px" }}
                            />
                        </div>

                        <div className="flex justify-between flex-col">
                            <Button onClick={(e) => { e.preventDefault(); setEditTitleDialogOpen(true); }} className="cursor-pointer bg-[#27272A] w-full hover:bg-[#27272A]/60 border border-gray-700 text-white">
                                Change Node Title
                            </Button>

                            <Button onClick={(e) => { e.preventDefault(); setAddSection(true); }} className="cursor-pointer bg-[#27272A] w-full hover:bg-[#27272A]/60 border border-gray-700 text-white mt-3">
                                Add Section
                            </Button>
                        </div>

                        <div className="border-solid border-[#11111126] dark:border-[#FFFFFF26] flex-1 my-3" style={{ borderTopWidth: "1px" }} />

                        <SortableList items={sections} onChange={(newSections) => {
                            if (typeof setNodes !== 'function') return;
                            setNodes(prev => {
                                if (!Array.isArray(prev)) return prev;
                                const next = [...prev];
                                if (index == null || !next[index]) return next;
                                const updatedNode = { ...next[index], data: { ...(next[index].data ?? {}), sections: newSections } };
                                next[index] = updatedNode;
                                return next;
                            });
                        }} renderItem={(item) => (
                            <SortableList.Item id={item.id}>
                                <div className="p-3 my-3 border flex justify-between items-center text-sm border-gray-600 rounded-md bg-gray-800 group relative">
                                    <div >
                                        <p className="font-semibold">{item?.title}</p>
                                        <p className="text-gray-400 mt-1 text-xs italic w-[60%]">
                                            {item?.description}
                                        </p>
                                    </div >

                                    <div className="flex items-center gap-2">
                                        <Button className="cursor-pointer opacity-0 group-hover:opacity-100 duration-300 bg-[#27272A] hover:bg-[#27272A]/90 border border-gray-700 text-white" onClick={(e) => { e.stopPropagation(); setSelectedSectionId(item.id); setEditDialogOpen(true); }}>
                                            <Pencil />
                                        </Button>

                                        <Button variant={"destructive"} className="cursor-pointer opacity-0 group-hover:opacity-100 duration-300 text-white" onClick={(e) => { e.stopPropagation(); setSelectedSectionId(item.id); setDeleteDialogOpen(true); }}>
                                            <Trash2 />
                                        </Button>

                                        <SortableList.DragHandle />
                                    </div>
                                </div>
                            </SortableList.Item>
                        )}
                        />

                    </div>
                </SheetContent>
            </Sheet>
            <DeleteDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen} selectedSectionId={selectedSectionId} setSelectedSectionId={setSelectedSectionId} onDelete={handleDelete} />
            <EditDialog editDialogOpen={editDialogOpen} setEditDialogOpen={setEditDialogOpen} selectedSection={sections.find(s => s.id === selectedSectionId)} onSave={handleEdit} />
            <EditTitleDialog editTitleDialogOpen={editTitleDialogOpen} setEditTitleDialogOpen={setEditTitleDialogOpen} setNodes={setNodes} node={node} />
            <AddSectionDialog addSection={addSection} setAddSection={setAddSection} setNodes={setNodes} node={node} index={index} />
        </>

    );
}

const DeleteDialog = ({ deleteDialogOpen, setDeleteDialogOpen, selectedSectionId, setSelectedSectionId, onDelete }) => {
    const handleConfirm = () => {
        if (selectedSectionId) onDelete(selectedSectionId);
        setSelectedSectionId(null);
        setDeleteDialogOpen(false);
    }

    return (
        <>
            <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) { setSelectedSectionId(null); } setDeleteDialogOpen(open); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are You Sure Want to Delete</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose>
                            <Button variant={'outline'} className={'cursor-pointer'}>Cancel</Button>
                        </DialogClose>
                        <Button variant={'destructive'} onClick={handleConfirm} className={'cursor-pointer'}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
const EditDialog = ({ editDialogOpen, setEditDialogOpen, selectedSection, onSave }) => {

    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")

    useEffect(() => {
        if (selectedSection) {
            setName(selectedSection.title ?? "");
            setDesc(selectedSection.description ?? "");
        } else {
            setName("");
            setDesc("");
        }
    }, [selectedSection])

    const handleSave = () => {
        if (!selectedSection) return;
        onSave({ id: selectedSection.id, title: name, description: desc });
        setEditDialogOpen(false);
    }

    return (
        <>
            <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className={'flex flex-col gap-2 text-center sm:text-left'}>Edit Section</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className={'text-right'} htmlFor='name' >Name</Label>
                            <Input className={'col-span-3'} id='name' placeholder="Enter section name" value={name} onChange={(e) => { e.preventDefault(); setName(e.target.value) }} />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className={'text-right'} htmlFor='desc'>Description</Label>
                            <Input className={'col-span-3'} id='desc' placeholder="Enter section description (optional)" value={desc} onChange={(e) => { e.preventDefault(); setDesc(e.target.value) }} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose>
                            <Button variant={'outline'} className={'cursor-pointer'} >Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSave} className={'bg-blue-500  text-white hover:bg-blue-500/65 duration-200 cursor-pointer'}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
const EditTitleDialog = ({ editTitleDialogOpen, setEditTitleDialogOpen, setNodes, node }) => {
    const [title, setTitle] = useState("")

    useEffect(() => {
        if (node) {
            setTitle(node?.data?.label ?? "");
        } else {
            setTitle("");
        }
    }, [node])

    const handleSave = () => {
        if (typeof setNodes !== 'function') return;
        setNodes(prev => {
            if (!Array.isArray(prev)) return prev;
            const next = [...prev];
            const idx = next.findIndex(n => n.id === node?.id);
            if (idx === -1) return next;
            const updatedNode = { ...next[idx], data: { ...(next[idx].data ?? {}), label: title } };
            next[idx] = updatedNode;
            return next;
        });
        setEditTitleDialogOpen(false);
    }
    return (
        <Dialog open={editTitleDialogOpen} onOpenChange={(open) => { setEditTitleDialogOpen(open) }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={'flex flex-col gap-2 text-center sm:text-left'}>Edit Node Title</DialogTitle>
                </DialogHeader>

                <DialogDescription className={'grid grid-cols-4 items-center gap-4'} >
                    <Label className={'text-right'} htmlFor='name' >Node Title</Label>
                    <Input className={'col-span-3'} id='name' placeholder="Enter Node Title" value={title} onChange={(e) => { e.preventDefault(); setTitle(e.target.value) }} />
                </DialogDescription>

                <DialogFooter>
                    <DialogClose >
                        <div className="cursor-pointer border shadow-xs hover:text-accent-foreground bg-input/30 border-input hover:bg-input/50 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 h-9 px-4 py-2">
                            Cancel
                        </div>
                    </DialogClose>
                    <Button onClick={handleSave} className={'bg-blue-500  text-white hover:bg-blue-500/65 duration-200 cursor-pointer'}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
const AddSectionDialog = ({ addSection, setAddSection, setNodes, node, index }) => {
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")

    const handleSave = () => {
        if (typeof setNodes !== 'function') return;
        const newSection = {
            id: Date.now().toString(),
            title: name || "Untitled",
            description: desc || ""
        };

        setNodes(prev => {
            if (!Array.isArray(prev)) return prev;
            const next = [...prev];
            const idx = (typeof index === 'number' && index >= 0) ? index : next.findIndex(n => n.id === node?.id);
            if (idx == null || idx === -1 || !next[idx]) return next;
            const oldSections = next[idx].data?.sections ?? [];
            const updatedNode = { ...next[idx], data: { ...(next[idx].data ?? {}), sections: [...oldSections, newSection] } };
            next[idx] = updatedNode;
            return next;
        });

        setName("");
        setDesc("");
        setAddSection(false);
    }

    return (
        <Dialog open={addSection} onOpenChange={(open) => { if (!open) { setName(''); setDesc(''); } setAddSection(open); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={'flex flex-col gap-2 text-center sm:text-left'}>Add New Section</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className={'text-right'} htmlFor='name' >Name</Label>
                        <Input className={'col-span-3'} id='name' placeholder="Enter section name" value={name} onChange={(e) => { e.preventDefault(); setName(e.target.value) }} />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className={'text-right'} htmlFor='desc'>Description</Label>
                        <Input className={'col-span-3'} id='desc' placeholder="Enter section description (optional)" value={desc} onChange={(e) => { e.preventDefault(); setDesc(e.target.value) }} />
                    </div>
                </div>
                
                <DialogFooter>
                    <DialogClose>
                        <Button variant={'outline'} className={'cursor-pointer'} >Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave} className={'bg-blue-500  text-white hover:bg-blue-500/65 duration-200 cursor-pointer'}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}