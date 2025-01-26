function Dump(item)
    if type(item) == 'table' then
        local s = '{ '
        for k, v in pairs(item) do
            if k ~= "__index" then
                if type(k) ~= 'number' then k = '"' .. k .. '"' end
                s = s .. '[' .. k .. '] = ' .. Dump(v) .. ','
            end
        end
        return s .. '} '
    else
        return tostring(item)
    end
end
