"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Pencil, Trash2, X } from "lucide-react"
import { Button } from "@nextui-org/button"
import { Image, Input, Textarea } from "@nextui-org/react"
import { createProduct, getAllProducts, updateProduct, deleteProduct } from "@/services/apis/products"
import { createCategory, getAllCategories, deleteCategory } from "@/services/apis/categories"

export default function ProductMgt() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [editingProduct, setEditingProduct] = useState(null)
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "",
        price: "",
        avlQuantity: "",
        description: "",
        image: null,
    })
    const [newCategory, setNewCategory] = useState({
        name: "",
        image: null,
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const allProducts = await getAllProducts()
            setProducts(allProducts)
            const allCategories = await getAllCategories()
            setCategories(allCategories)
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "All" || product.category._id === categoryFilter
        return matchesSearch && matchesCategory
    })

    const handleFileChange = (e, setter) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(prevState => ({ ...prevState, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = async () => {
        try {
            await createProduct(newProduct)
            fetchData()
            setNewProduct({ name: "", category: "", price: "", avlQuantity: "", image: null, description: "" })
        } catch (error) {
            console.error("Error adding product:", error)
        }
    }

    const handleEditProduct = async () => {
        try {
            await updateProduct(editingProduct._id, editingProduct)
            fetchData()
            setEditingProduct(null)
        } catch (error) {
            console.error("Error editing product:", error)
        }
    }

    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id)
            fetchData()
        } catch (error) {
            console.error("Error deleting product:", error)
        }
    }

    const handleAddCategory = async () => {
        try {
            await createCategory(newCategory)
            fetchData()
            setNewCategory({ name: "", image: null })
        } catch (error) {
            console.error("Error adding category:", error)
        }
    }

    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(id)
            fetchData()
        } catch (error) {
            console.error("Error deleting category:", error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8  overflow-y-scroll max-h-screen">
            <h1 className="text-3xl font-bold mb-8">Product Management</h1>

            <Tabs defaultValue="products" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                            <Search className="text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="flat" color="warning">
                                        <Plus className="mr-2 h-4 w-4" /> Add Product
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Product</DialogTitle>
                                        <DialogDescription>
                                            Enter the details of the new product.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="description" className="text-right">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={newProduct.description}
                                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="category" className="text-right">
                                                Category
                                            </Label>
                                            <Select
                                                value={newProduct.category}
                                                onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="price" className="text-right">
                                                Price
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="avlQuantity" className="text-right">
                                                Quantity
                                            </Label>
                                            <Input
                                                id="avlQuantity"
                                                type="number"
                                                value={newProduct.avlQuantity}
                                                onChange={(e) => setNewProduct({ ...newProduct, avlQuantity: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="image" className="text-right">
                                                Image
                                            </Label>
                                            <Input
                                                id="image"
                                                type="file"
                                                onChange={(e) => handleFileChange(e, setNewProduct)}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={handleAddProduct}>Add Product</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        <img src={product.imageURL} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.category.name}</TableCell>
                                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                                    <TableCell>{product.avlQuantity}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" onClick={() => setEditingProduct(product)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Product</DialogTitle>
                                                        <DialogDescription>
                                                            Make changes to the product details.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="edit-name" className="text-right">
                                                                Name
                                                            </Label>
                                                            <Input
                                                                id="edit-name"
                                                                value={editingProduct?.name || ""}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                                                className="col-span-3"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="edit-description" className="text-right">
                                                                Description
                                                            </Label>
                                                            <Textarea
                                                                id="edit-description"
                                                                value={editingProduct?.description || ""}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                                                className="col-span-3"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="edit-category" className="text-right">
                                                                Category
                                                            </Label>
                                                            <Select
                                                                value={editingProduct?.category._id || ""}
                                                                onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                                                            >
                                                                <SelectTrigger className="w-[180px]">
                                                                    <SelectValue placeholder="Select category" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {categories.map((category) => (
                                                                        <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="edit-price" className="text-right">
                                                                Price
                                                            </Label>
                                                            <Input
                                                                id="edit-price"
                                                                type="number"
                                                                value={editingProduct?.price || ""}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                                                className="col-span-3"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="edit-quantity" className="text-right">
                                                                Quantity
                                                            </Label>
                                                            <Input
                                                                id="edit-quantity"
                                                                type="number"
                                                                value={editingProduct?.avlQuantity || ""}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, avlQuantity: e.target.value })}
                                                                className="col-span-3"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="edit-image" className="text-right">
                                                                Image
                                                            </Label>
                                                            <Input
                                                                id="edit-image"
                                                                type="file"
                                                                onChange={(e) => handleFileChange(e, setEditingProduct)}
                                                                className="col-span-3"
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit" onClick={handleEditProduct}>Save Changes</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="destructive" onClick={() => handleDeleteProduct(product._id)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="categories">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Categories</CardTitle>
                            <CardDescription>Add or remove product categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 mb-5">
                                <div className="grid grid-cols-[1fr_1fr_.3fr] gap-2">
                                    <Input
                                        placeholder="New category name"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    />
                                    <Input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, setNewCategory)}
                                    />
                                    <Button variant="flat" color="warning" onClick={handleAddCategory}>Add Category</Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ">
                                {categories.map((category) => (
                                    <div
                                        key={category._id}
                                        className="relative p-4 rounded-xl cursor-pointer bg-bsecondary/5 hover:bg-bsecondary/10 h-28 w-28 flex flex-col items-center justify-between"
                                    >
                                        <Button
                                            isIconOnly
                                            color="danger"
                                            variant="flat"
                                            className="absolute -top-3 -right-3  z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCategory(category._id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Image
                                            isBlurred
                                            className="rounded-lg aspect-square z-0"
                                            src={category.imgURL}
                                            alt={category.name}
                                            height={60}
                                            width={60}
                                        />
                                        <p className="font-semibold text-bsecondary">{category.name}</p>
                                    </div>
                                ))}
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}