import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import soloImage from "../../assets/logo_white.png";
import { LockKeyhole, Mail, MapPinHouse, UserRound, Eye, EyeOff, Cake } from "lucide-react";
import { useState} from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "@/components/redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import {showErrorToasts, showSuccessToast} from "@/components/utils/ToastNotifications.tsx";
import { ToastStatusMessages } from "@/constants/toastStatusMessages.ts";
import { UiMessages } from "@/constants/uiMessages.ts";
import { format } from "date-fns";

export default function RegisterPage({className, ...props}: React.ComponentProps<"div">) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", email: "", birthday: "", country: "", password: "", password_confirm: "" });
    const currentDateFormatted = format(new Date(), "dd.MM.yyyy");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    const formatBirthdayDate = (inputVal: string): string => {
        const digitsOnly = inputVal.replace(/\D/g, '');
        let formattedDate = '';

        if (digitsOnly.length > 0) {
            formattedDate = digitsOnly.substring(0, Math.min(2, digitsOnly.length));

            if (digitsOnly.length > 2) {
                formattedDate += '.' + digitsOnly.substring(2, Math.min(4, digitsOnly.length));

                if (digitsOnly.length > 4) {
                    formattedDate += '.' + digitsOnly.substring(4, Math.min(8, digitsOnly.length));
                }
            }
        }

        return formattedDate;
    };

    const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, birthday: formatBirthdayDate(e.target.value) });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const processedFormData = { ...formData };

        try {
            const [day, month, year] = formData.birthday.split('.');
            if (!day || !month || !year || year.length !== 4) {
                showErrorToasts(ToastStatusMessages.AUTH.REGISTRATION_BIRTHDAY_FORMAT_ERROR);
                return;
            }

            const dateObj = new Date(`${year}-${month}-${day}`);
            if (isNaN(dateObj.getTime())) {
                showErrorToasts(ToastStatusMessages.AUTH.REGISTRATION_BIRTHDAY_INCORRECT_ERROR);
                return;
            }

            processedFormData.birthday = `${year}-${month}-${day}`;

        } catch {
            showErrorToasts(ToastStatusMessages.AUTH.REGISTRATION_BIRTHDAY_BASIC_ERROR);
            return;
        }

        const result = await registerUser(processedFormData, dispatch);
        if (result.success) {
            showSuccessToast(ToastStatusMessages.AUTH.REGISTRATION_SUCCESS);
            navigate("/login");
        } else {
            showErrorToasts(result.errors || ToastStatusMessages.AUTH.REGISTRATION_FAILED);
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-2xl">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <div className="relative hidden bg-muted md:block flex items-center justify-center">
                                <img
                                    src={soloImage}
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale bg-white"
                                />
                            </div>
                            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold">{UiMessages.REGISTER.TITLE}</h1>
                                        <p className="text-balance text-muted-foreground">
                                            {UiMessages.REGISTER.DESCRIPTION}
                                        </p>
                                    </div>
                                    <div className="relative flex items-center gap-2">
                                        <div className="absolute left-2">
                                            <UserRound />
                                        </div>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            placeholder="Full Name"
                                            className="pl-10"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="relative flex items-center gap-2">
                                        <div className="absolute left-2">
                                            <Mail />
                                        </div>
                                        <Input
                                            id="email"
                                            type="text"
                                            placeholder="Email"
                                            className="pl-10"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="relative flex items-center gap-2">
                                        <div className="absolute left-2">
                                            <Cake />
                                        </div>
                                        <Input
                                            id="birthday"
                                            className="pl-10"
                                            placeholder={`${UiMessages.REGISTER.BIRTHDAY_INPUT_TITLE} (${currentDateFormatted})`}
                                            value={formData.birthday}
                                            onChange={handleBirthdayChange}
                                            autoComplete="off"
                                            maxLength={10}
                                        />
                                    </div>

                                    <div className="relative flex items-center gap-2">
                                        <div className="absolute left-2">
                                            <MapPinHouse />
                                        </div>
                                        <Select value={formData.country}
                                                     onValueChange={(value) => setFormData({ ...formData, country: value })}
                                        >
                                            <SelectTrigger className="pl-10 w-full">
                                                <SelectValue placeholder="Country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ukraine">Ukraine</SelectItem>
                                                <SelectItem value="Finland">Finland</SelectItem>
                                                <SelectItem value="Estonia">Estonia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="relative flex items-center gap-2">
                                        <div className="absolute left-2">
                                            <LockKeyhole />
                                        </div>
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="pl-10"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-2 cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="relative flex items-center gap-2">
                                        <div className="absolute left-2 ">
                                            <LockKeyhole />
                                        </div>
                                        <Input
                                            id="password_confirm"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            className="pl-10"
                                            required
                                            value={formData.password_confirm}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute right-2 cursor-pointer"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={!formData.fullName || !formData.email || !formData.birthday || !formData.country || !formData.password || !formData.password_confirm}>
                                        {UiMessages.REGISTER.BUTTON}
                                    </Button>

                                    <div className="text-center text-sm">
                                        {UiMessages.REGISTER.ALREADY_ACCOUNT}
                                        <a href="/login" className="underline underline-offset-4">
                                            {UiMessages.REGISTER.LOG_IN_BUTTON}
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
