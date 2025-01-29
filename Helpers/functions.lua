function Dump(item, level)
    level = level or 1
    if level > 10 then return "" end

    if type(item) == 'table' then
        local s = '{ '
        for k, v in pairs(item) do
            if k ~= "__index" then
                if type(k) ~= 'number' then k = '"' .. k .. '"' end
                s = s .. '[' .. k .. '] = ' .. Dump(v, level + 1) .. ','
            end
        end
        return s .. '} '
    else
        return tostring(item)
    end
end
