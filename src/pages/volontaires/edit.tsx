import { useState, useEffect } from 'react';
import { Edit, useForm, useSelect, getValueFromEvent } from "@refinedev/antd";
import { Form, Input, Upload, Select } from "antd";
import { useTranslate } from "@refinedev/core";
import useAvatarUpload from '../../utility/useAvatarUpload';

export const VolontaireEdit = () => {
    const translate = useTranslate();
    const { formProps, saveButtonProps, queryResult, onFinish } = useForm();
    const { uploadAvatar, uploading } = useAvatarUpload();
    const [uploadUrl, setUploadUrl] = useState<string | null>(null);
    const volontairesData = queryResult?.data?.data;

    useEffect(() => {
        setUploadUrl(volontairesData?.avatar_url || "");
    }, []);

    const { selectProps: typesVolontaireSelectProps } = useSelect({
        resource: "types_volontaire",
        optionLabel: "nom",
        optionValue: "nom",
        sorters: [
            {
                field: "nom",
                order: "asc",
            },
        ],
    });

    const { selectProps: organisationSelectProps } = useSelect({
        resource: "organisations",
        optionLabel: "nom",
        optionValue: "id",
        sorters: [
            {
                field: "nom",
                order: "asc",
            },
        ],
    });

    const handleAvatarUpload = async (file: any) => {
        const uploadedUrl = await uploadAvatar(file);
        if (uploadedUrl) {
            setUploadUrl(uploadedUrl);
        }
    };

    const handleOnFinish = async (values: any) => {
        onFinish({
          ...values,
          avatar_url: uploadUrl
        });
    };

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>
                <Form.Item
                    label={translate("Prénom Nom")}
                    name={["full_name"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={translate("Email")}
                    name={["email"]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label={translate("Photo")}>
                    <Form.Item
                        name="avatar_url"
                        getValueProps={(value) => ({
                            fileList: [{ url: uploadUrl, name: uploadUrl, uid: uploadUrl }],
                        })}
                        noStyle
                    >
                        <Upload.Dragger
                            listType="picture"
                            beforeUpload={(file) => {
                                handleAvatarUpload(file);
                                return false;
                            }}
                            onRemove={() => {
                                setUploadUrl(null);
                            }}
                            disabled={uploading}
                        >
                            <p className="ant-upload-text">
                                Drag and drop a file into this area
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>
                <Form.Item
                    label={translate("Volontaire")}
                    name={"types_volontaire"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...typesVolontaireSelectProps} />
                </Form.Item>
                <Form.Item
                    label={translate("Organisation")}
                    name={"organisation"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...organisationSelectProps} />
                </Form.Item>
            </Form>
        </Edit>
    );
};
